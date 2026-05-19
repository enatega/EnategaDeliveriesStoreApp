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

    const formattedComment = formatStoreComment(comment);
    if (!formattedComment) return null;

    return (
        <View style={[styles.commentBox, { backgroundColor: "#F3F4F6" }]}>
            <Text style={styles.commentLabel} weight="medium">
                {t("order_card_comment")}
            </Text>
            <Text style={styles.commentText} weight="medium">{formattedComment}</Text>
        </View>
    );
}

function formatStoreComment(comment: string | null): string | null {
    if (!comment) return null;

    const trimmed = comment.trim();
    if (!trimmed) return null;

    // Keep only the store-facing section and remove common prefixes from display.
    const lines = trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const filtered = lines
        .filter((line) => !/^courier\s*:/i.test(line))
        .filter((line) => !/^rider\s*:/i.test(line))
        .map((line) => line.replace(/^restaurant\s*:\s*/i, "").trim())
        .filter(Boolean);

    if (filtered.length === 0) return null;
    return filtered.join("\n");
}
