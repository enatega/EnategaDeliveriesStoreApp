import { NativeModules, Platform } from 'react-native';
import {
  BLEPrinter,
  PrinterWidth,
  type IBLEPrinter,
  type PrinterImageOptions,
} from 'react-native-thermal-receipt-printer-image-qr';

export type ThermalPrinterDevice = {
  name: string;
  address: string;
};

const imageOptions: PrinterImageOptions = {
  beep: false,
  cut: false,
  tailingLine: false,
  printerWidthType: PrinterWidth['80mm'],
  imageWidth: 576,
};

let initialized = false;

type NativeBlePrinter = {
  printImageBase64: (
    base64: string,
    widthOrOptions: number | PrinterImageOptions,
    heightOrCallback: number | ((error: unknown) => void),
    callback?: (error: unknown) => void,
  ) => void;
};

const nativePrinter = NativeModules.RNBLEPrinter as NativeBlePrinter | undefined;

async function init() {
  if (initialized) return;
  await BLEPrinter.init();
  initialized = true;
}

export const thermalPrinter = {
  init,

  async getDevices(): Promise<ThermalPrinterDevice[]> {
    await init();
    try {
      const devices = await BLEPrinter.getDeviceList();
      return (devices as IBLEPrinter[]).map((device) => ({
        name: device.device_name || 'Unknown printer',
        address: device.inner_mac_address,
      }));
    } catch (error) {
      if (String(error).toLowerCase().includes('no device found')) return [];
      throw error;
    }
  },

  async connect(address: string): Promise<ThermalPrinterDevice> {
    await init();
    const device = await BLEPrinter.connectPrinter(address);
    return {
      name: device?.device_name || 'Unknown printer',
      address: device?.inner_mac_address || address,
    };
  },

  async close(): Promise<void> {
    try {
      await BLEPrinter.closeConn();
    } catch {
      // No active connection is already the desired state.
    }
  },

  async printImage(base64: string): Promise<void> {
    const pureBase64 = base64.replace(/^data:image\/[^;]+;base64,/, '');
    if (!nativePrinter?.printImageBase64) {
      BLEPrinter.printImageBase64(pureBase64, imageOptions);
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const timeout = setTimeout(() => {
        settled = true;
        resolve();
      }, 700);
      const callback = (error: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        error ? reject(error) : resolve();
      };

      if (Platform.OS === 'ios') {
        nativePrinter.printImageBase64(pureBase64, imageOptions, callback);
      } else {
        nativePrinter.printImageBase64(
          pureBase64,
          imageOptions.imageWidth ?? 576,
          imageOptions.imageHeight ?? 0,
          callback,
        );
      }
    });
  },

  cut: () =>
    BLEPrinter.printBill('', {
      beep: false,
      cut: true,
      tailingLine: true,
    }),
};

export const RECEIPT_WIDTH = 284;
