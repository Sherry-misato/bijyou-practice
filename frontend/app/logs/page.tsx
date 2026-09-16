"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Spinner,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { fetchLogs, createLog, deleteLog, LessonLog } from "../lib/api";
import PageHeader from "../components/PageHeader";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LessonLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(todayStr());
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadLogs = () => {
    setLoading(true);
    setError(null);
    fetchLogs()
      .then(setLogs)
      .catch(() => setError("レッスン日記の読み込みに失敗しました。"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSubmit = async () => {
    if (submitting) return; // 連打防止
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await createLog({ date, content });
      setContent("");
      loadLogs();
    } catch {
      setError("日記の登録に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deletingId !== null) return;
    if (!window.confirm("この日記を削除しますか？")) return;

    setDeletingId(id);
    try {
      await deleteLog(id);
      loadLogs();
    } catch {
      setError("削除に失敗しました。");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container maxW="720px" px={{ base: "4", md: "6" }} py="8">
      <PageHeader
        emoji="📔"
        frenchSubtitle="Mon journal de danse"
        title="レッスン日記"
        description="今日練習した内容、できたこと、難しかったこと、次回意識することを記録しましょう。"
      />

      <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="6" boxShadow="sm" mb="8" className="bijyou-card">
        <Stack gap="3">
          <Box>
            <Text fontSize="xs" fontWeight="700" color="pink.700" mb="1">
              日付
            </Text>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              borderColor="pink.200"
              maxW="200px"
            />
          </Box>
          <Box>
            <Text fontSize="xs" fontWeight="700" color="pink.700" mb="1">
              内容
            </Text>
            <Textarea
              placeholder="例：プリエとタンデュを重点的に練習した。軸がまだぶれる。"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              borderColor="pink.200"
              rows={4}
            />
          </Box>
          <Button
            className="bijyou-btn-cute"
            colorPalette="pink"
            alignSelf="flex-end"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!content.trim()}
          >
            記録する ✨
          </Button>
        </Stack>
      </Box>

      {error && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="xl" p="4" mb="4">
          <Text color="red.600" fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      {loading ? (
        <Stack align="center" py="10">
          <Spinner color="pink.400" size="lg" />
        </Stack>
      ) : logs.length === 0 ? (
        <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            まだ日記がありません。今日の練習を記録してみましょう。
          </Text>
        </Box>
      ) : (
        <Stack gap="4">
          {logs.map((log) => (
            <Box key={log.id} className="bijyou-card" bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="5" boxShadow="sm">
              <Stack direction="row" justify="space-between" align="flex-start">
                <Text fontSize="xs" fontWeight="700" color="pink.600">
                  {log.date}
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="pink"
                  onClick={() => handleDelete(log.id)}
                  loading={deletingId === log.id}
                >
                  削除
                </Button>
              </Stack>
              <Text mt="2" fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                {log.content}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
