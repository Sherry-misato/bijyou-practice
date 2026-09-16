"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Spinner,
  AspectRatio,
  Badge,
  Input,
  Button,
  HStack,
} from "@chakra-ui/react";
import { fetchPasList, uploadPasVideo, Pas } from "./lib/api";
import { useViewMode } from "./contexts/ViewModeContext";
import PageHeader from "./components/PageHeader";

export default function HomePage() {
  const [pasList, setPasList] = useState<Pas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openScene, setOpenScene] = useState<Record<number, boolean>>({});
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mode } = useViewMode();

  // 表示モードに応じてカードの列数を切り替える（"自動"の場合のみ画面幅に追従）
  const columns = mode === "mobile" ? 1 : mode === "desktop" ? 2 : { base: 1, md: 2 };

  useEffect(() => {
    let cancelled = false;

    fetchPasList()
      .then((data) => {
        if (!cancelled) setPasList(data);
      })
      .catch(() => {
        if (!cancelled) setError("パ辞書の読み込みに失敗しました。時間をおいて再度お試しください。");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pasList;
    return pasList.filter(
      (pas) =>
        pas.french.toLowerCase().includes(q) ||
        pas.japanese.toLowerCase().includes(q) ||
        pas.meaning.toLowerCase().includes(q)
    );
  }, [pasList, query]);

  const toggleScene = (id: number) => {
    setOpenScene((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVideoUpload = async (pas: Pas, file: File | null) => {
    if (!file || uploadingId !== null) return; // 連打防止
    setUploadingId(pas.id);
    setUploadError(null);
    try {
      const updated = await uploadPasVideo(pas.id, file);
      setPasList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      setUploadError("動画のアップロードに失敗しました。ファイル形式・サイズを確認してください。");
    } finally {
      setUploadingId(null);
    }
  };

  // YouTubeなどの埋め込みURLかどうかを判定して、iframeか<video>かを切り替える
  const isEmbedUrl = (url: string) => url.includes("/embed/");

  return (
    <Container maxW="960px" px={{ base: "4", md: "6" }} py="8">
      <PageHeader
        emoji="🩰"
        frenchSubtitle="Le vocabulaire du ballet"
        title="パ辞書"
        description="バレエのパ（技）の意味・動き方・注意点をいつでも確認できます。気になるパを選んで、お手本動画もチェックしましょう。"
      />

      {/* 検索 */}
      <Box mb="6">
        <Input
          placeholder="パの名前や意味で検索（例：プリエ、回転 など）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="white"
          borderColor="pink.200"
          borderRadius="full"
          px="5"
          py="5"
          fontSize="sm"
          _focus={{ borderColor: "pink.400", boxShadow: "0 0 0 1px var(--chakra-colors-pink-400)" }}
        />
      </Box>

      {uploadError && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="xl" p="4" mb="4">
          <Text color="red.600" fontSize="sm">
            {uploadError}
          </Text>
        </Box>
      )}

      {loading && (
        <Stack align="center" py="12">
          <Spinner color="pink.400" size="lg" />
          <Text color="gray.500" fontSize="sm">
            読み込み中です…
          </Text>
        </Stack>
      )}

      {!loading && error && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="xl" p="4">
          <Text color="red.600" fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      {!loading && !error && pasList.length === 0 && (
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="pink.100"
          borderRadius="xl"
          p="8"
          textAlign="center"
        >
          <Text color="gray.500" fontSize="sm">
            まだパ辞書のデータが登録されていません。
          </Text>
        </Box>
      )}

      {!loading && !error && pasList.length > 0 && filteredList.length === 0 && (
        <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            「{query}」に一致するパが見つかりませんでした。
          </Text>
        </Box>
      )}

      {!loading && !error && filteredList.length > 0 && (
        <SimpleGrid columns={columns} gap="5">
          {filteredList.map((pas) => (
            <Box
              key={pas.id}
              className="bijyou-card bijyou-fade-in"
              bg="white"
              borderWidth="1px"
              borderColor="pink.100"
              borderTopWidth="3px"
              borderTopColor="pink.300"
              borderRadius="xl"
              p="6"
              boxShadow="sm"
              position="relative"
            >
              <Stack gap="1" mb="3">
                <Heading
                  className="font-display"
                  fontSize="2xl"
                  fontStyle="italic"
                  color="pink.700"
                  letterSpacing="0.02em"
                >
                  {pas.french}
                </Heading>
                <Badge
                  variant="outline"
                  colorPalette="pink"
                  borderRadius="full"
                  w="fit-content"
                  px="3"
                  borderColor="pink.300"
                  color="pink.600"
                >
                  {pas.japanese}
                </Badge>
              </Stack>

              <Stack gap="2" fontSize="sm" color="gray.700">
                <Text>
                  <Text as="span" fontWeight="700" color="pink.700">
                    意味：
                  </Text>
                  {pas.meaning}
                </Text>
                <Text>
                  <Text as="span" fontWeight="700" color="pink.700">
                    動き方：
                  </Text>
                  {pas.movement}
                </Text>
                <Text>
                  <Text as="span" fontWeight="700" color="pink.700">
                    注意点：
                  </Text>
                  {pas.caution}
                </Text>
              </Stack>

              {/* 使用場面：初期は非表示。ボタンで開閉する */}
              <Box mt="3">
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="pink"
                  onClick={() => toggleScene(pas.id)}
                  px="0"
                  fontWeight="600"
                >
                  {openScene[pas.id] ? "使用場面を閉じる ▲" : "どの場面で使われる？ ▼"}
                </Button>
                {openScene[pas.id] && (
                  <Box mt="2" p="3" bg="pink.50" borderRadius="lg" fontSize="sm" color="gray.700">
                    {pas.used_scene}
                  </Box>
                )}
              </Box>

              <Box mt="4">
                <HStack mb="2" gap="2">
                  <Box w="16px" h="1px" bg="#C9A66B" />
                  <Text fontSize="xs" fontWeight="700" color="pink.700" letterSpacing="0.05em">
                    お手本動画
                  </Text>
                </HStack>

                {pas.sample_video_url && (
                  <AspectRatio ratio={16 / 9} borderRadius="lg" overflow="hidden" mb="2">
                    {isEmbedUrl(pas.sample_video_url) ? (
                      <iframe
                        src={pas.sample_video_url}
                        title={`${pas.french} お手本動画`}
                        allowFullScreen
                      />
                    ) : (
                      <video src={pas.sample_video_url} controls />
                    )}
                  </AspectRatio>
                )}

                {!pas.sample_video_url && (
                  <Text fontSize="xs" color="gray.400" mb="2">
                    まだ動画が登録されていません。
                  </Text>
                )}

                <Input
                  type="file"
                  accept="video/*"
                  size="xs"
                  fontSize="xs"
                  borderColor="pink.200"
                  onChange={(e) => handleVideoUpload(pas, e.target.files?.[0] ?? null)}
                  disabled={uploadingId === pas.id}
                />
                {uploadingId === pas.id && (
                  <Text fontSize="xs" color="pink.500" mt="1">
                    アップロード中…
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
