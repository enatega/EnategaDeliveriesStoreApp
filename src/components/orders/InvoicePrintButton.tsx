import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import type { Order } from '../../api/orderServicesTypes';
import { useCurrencyFormatter } from '../../hooks/useCurrency';
import { useTranslations } from '../../localization/LocalizationProvider';
import { useAppTheme } from '../../theme/ThemeProvider';
import { RECEIPT_WIDTH, thermalPrinter, type ThermalPrinterDevice } from '../../services/printer';
import { formatOrderInvoice } from '../../utils/orderInvoice';
import Text from '../Text';

const SAVED_PRINTER_KEY = 'thermal_printer';

type Status = 'preparing' | 'scanning' | 'selecting' | 'printing' | 'error';

async function requestBluetoothPermission() {
  if (Platform.OS !== 'android') return true;

  const permissions =
    Number(Platform.Version) >= 31
      ? [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]
      : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
  const result = await PermissionsAndroid.requestMultiple(permissions);
  return Object.values(result).every(
    (permission) => permission === PermissionsAndroid.RESULTS.GRANTED,
  );
}

function friendlyPrinterError(error: unknown, fallback: string) {
  const message = String(error ?? '').toLowerCase();
  if (message.includes('bluetooth') && message.includes('disabled')) {
    return 'Bluetooth is turned off. Enable it and try again.';
  }
  if (
    message.includes('socket') ||
    message.includes('connect') ||
    message.includes('output stream')
  ) {
    return 'Could not connect to the printer. Make sure it is powered on and nearby.';
  }
  if (message.includes('native module')) {
    return 'Thermal printing requires a development or production build.';
  }
  return fallback;
}

export default function InvoicePrintButton({ order }: { order: Order }) {
  const { t } = useTranslations('app');
  const { theme } = useAppTheme();
  const { formatAmount } = useCurrencyFormatter();
  const shotRef = useRef<ViewShot>(null);
  const startedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<Status>('preparing');
  const [devices, setDevices] = useState<ThermalPrinterDevice[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [printRequest, setPrintRequest] = useState(0);
  const [laidOut, setLaidOut] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const receipt = useMemo(
    () => formatOrderInvoice(order, formatAmount),
    [formatAmount, order],
  );

  const scan = useCallback(async () => {
    try {
      setStatus('scanning');
      setErrorMessage('');
      setDevices([]);
      if (!(await requestBluetoothPermission())) {
        setStatus('error');
        setErrorMessage(t('printer_permission_denied'));
        return;
      }
      const found = await thermalPrinter.getDevices();
      setDevices(found);
      setStatus('selecting');
    } catch (error) {
      setStatus('error');
      setErrorMessage(friendlyPrinterError(error, t('printer_scan_failed')));
    }
  }, [t]);

  useEffect(() => {
    if (!visible) {
      startedRef.current = false;
      setSelectedAddress(null);
      setLaidOut(false);
      setLogoLoaded(false);
      return;
    }

    let cancelled = false;
    const prepare = async () => {
      setStatus('preparing');
      try {
        if (!(await requestBluetoothPermission())) {
          if (!cancelled) {
            setStatus('error');
            setErrorMessage(t('printer_permission_denied'));
          }
          return;
        }

        const saved = await AsyncStorage.getItem(SAVED_PRINTER_KEY);
        const printer = saved ? (JSON.parse(saved) as ThermalPrinterDevice) : null;
        if (printer?.address) {
          if (!cancelled) {
            setSelectedAddress(printer.address);
            setPrintRequest((current) => current + 1);
          }
        } else if (!cancelled) {
          await scan();
        }
      } catch {
        if (!cancelled) await scan();
      }
    };

    void prepare();
    return () => {
      cancelled = true;
    };
  }, [scan, t, visible]);

  useEffect(() => {
    if (!visible || !laidOut || !logoLoaded || !selectedAddress || startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    const print = async () => {
      try {
        setStatus('printing');
        await new Promise((resolve) => setTimeout(resolve, 250));
        const base64 = await shotRef.current?.capture?.();
        if (!base64) throw new Error('Receipt rendering failed');

        await thermalPrinter.close();
        try {
          await thermalPrinter.connect(selectedAddress);
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 400));
          await thermalPrinter.connect(selectedAddress);
        }
        await thermalPrinter.printImage(base64);
        await thermalPrinter.cut();

        if (!cancelled) {
          setVisible(false);
          Alert.alert(t('printer_success_title'), t('printer_success_message'));
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(friendlyPrinterError(error, t('printer_print_failed')));
        }
      }
    };

    void print();
    return () => {
      cancelled = true;
    };
  }, [laidOut, logoLoaded, printRequest, selectedAddress, t, visible]);

  const selectPrinter = async (device: ThermalPrinterDevice) => {
    try {
      setStatus('preparing');
      const connected = await thermalPrinter.connect(device.address);
      await AsyncStorage.setItem(SAVED_PRINTER_KEY, JSON.stringify(connected));
      startedRef.current = false;
      setSelectedAddress(connected.address);
      setPrintRequest((current) => current + 1);
    } catch (error) {
      setStatus('error');
      setErrorMessage(friendlyPrinterError(error, t('printer_connect_failed')));
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.printButton,
          { borderColor: theme.colors.primary, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Feather name="printer" size={17} color={theme.colors.primary} />
        <Text color={theme.colors.primary} weight="semiBold">
          {t('order_print_invoice')}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
            <Text weight="bold" style={styles.title}>{t('printer_title')}</Text>

            {status === 'preparing' || status === 'scanning' || status === 'printing' ? (
              <View style={styles.centerState}>
                <ActivityIndicator color={theme.colors.primary} size="large" />
                <Text color={theme.colors.gray600}>
                  {status === 'printing' ? t('printer_printing') : t('printer_searching')}
                </Text>
              </View>
            ) : null}

            {status === 'selecting' ? (
              <View style={styles.deviceList}>
                {devices.length ? devices.map((device) => (
                  <Pressable
                    key={device.address}
                    onPress={() => void selectPrinter(device)}
                    style={[styles.device, { borderColor: theme.colors.gray200 }]}
                  >
                    <Feather name="printer" size={20} color={theme.colors.primary} />
                    <View style={styles.deviceText}>
                      <Text weight="semiBold">{device.name}</Text>
                      <Text color={theme.colors.gray500} style={styles.address}>{device.address}</Text>
                    </View>
                  </Pressable>
                )) : (
                  <Text color={theme.colors.gray600}>{t('printer_no_devices')}</Text>
                )}
              </View>
            ) : null}

            {status === 'error' ? (
              <View style={styles.centerState}>
                <Feather name="alert-circle" size={28} color="#EF4444" />
                <Text style={styles.error}>{errorMessage}</Text>
                {errorMessage.toLowerCase().includes('bluetooth is turned off') ? (
                  <Pressable onPress={() => void Linking.openSettings()}>
                    <Text color={theme.colors.primary} weight="semiBold">{t('printer_open_settings')}</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <View style={styles.actions}>
              <Pressable onPress={() => setVisible(false)} style={styles.action}>
                <Text color={theme.colors.gray600}>{t('printer_cancel')}</Text>
              </Pressable>
              {(status === 'selecting' || status === 'error') ? (
                <Pressable onPress={() => void scan()} style={styles.action}>
                  <Text color={theme.colors.primary} weight="semiBold">{t('printer_scan_again')}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <ViewShot
            ref={shotRef}
            options={{ format: 'png', result: 'base64', quality: 1 }}
            onLayout={() => setLaidOut(true)}
            style={styles.receipt}
          >
            <View style={styles.receiptLogoCrop}>
              <Image
                source={require('../../../assets/icon.png')}
                resizeMode="contain"
                onLoadEnd={() => setLogoLoaded(true)}
                style={styles.receiptLogo}
              />
            </View>
            <Text style={styles.receiptText}>{receipt}</Text>
          </ViewShot>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  action: { paddingHorizontal: 10, paddingVertical: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  address: { fontSize: 11 },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  centerState: { alignItems: 'center', gap: 12, paddingVertical: 28 },
  device: { alignItems: 'center', borderRadius: 10, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 12 },
  deviceList: { gap: 10, maxHeight: 320, paddingVertical: 12 },
  deviceText: { flex: 1, gap: 2 },
  error: { textAlign: 'center' },
  modal: { borderRadius: 16, maxWidth: 430, padding: 20, width: '100%' },
  printButton: { alignItems: 'center', borderRadius: 40, borderWidth: 1.5, flexDirection: 'row', gap: 8, height: 42, justifyContent: 'center', marginTop: 2 },
  receipt: {
    backgroundColor: '#FFFFFF',
    left: 0,
    opacity: 0.01,
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 0,
    position: 'absolute',
    top: 0,
    width: RECEIPT_WIDTH,
  },
  receiptLogo: { height: 380, left: -100, position: 'absolute', top: -118, width: 380 },
  receiptLogoCrop: {
    alignSelf: 'center',
    height: 150,
    marginBottom: 8,
    overflow: 'hidden',
    width: 180,
  },
  receiptText: { color: '#000000', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 12, lineHeight: 17 },
  title: { fontSize: 18, textAlign: 'center' },
});
