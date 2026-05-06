import React from "react";
import { View } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { styles } from "./styles";

type Props = {
    comment: string | null;
    theme: any;
};

export default function CommentSection({ comment, theme }: Props) {
    const { t } = useTranslations("app");

    if (!comment) return null;

    return (
        <View style={[styles.commentBox, { backgroundColor: theme.colors.background }]}>
            <Text style={styles.commentLabel} weight="semiBold">
                {t("order_card_comment")}
            </Text>
            <Text style={styles.commentText}>{comment}</Text>
        </View>
    );
}
