"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useViewMode } from "../contexts/ViewModeContext";
import PageHeader from "../components/PageHeader";

export default function ComparePage() {
  const { mode } = useViewMode();
  const columns = mode === "mobile" ? 1 : mode === "desktop" ? 2 : { base: 1, md: 2 };

  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [myUrl, setMyUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(50);
  const [blend, setBlend] = useState<"normal" | "difference">("normal");

  // アップロードした動画のURLは、ページを離れるときに解放する（メモリリーク防止）
  useEffect(() => {
    return () => {
      if (modelUrl) URL.revokeObjectURL(modelUrl);
      if (myUrl) URL.revokeObjectURL(myUrl);
    };
  }, [modelUrl, myUrl]);

  const handleModelFile = (file: File | null) => {
    if (!file) return;
    setModelUrl(URL.createObjectURL(file));
  };

  const handleMyFile = (file: File | null) => {
    if (!file) return;
    setMyUrl(URL.createObjectURL(file));
  };

  // 重ね合わせ表示の2本だけを同時に操作する（プレビュー側は個別のcontrolsで独立して操作できる）
  const modelRefOverlay = useRef<HTMLVideoElement>(null);
  const myRefOverlay = useRef<HTMLVideoElement>(null);
  const [playError, setPlayError] = useState<string | null>(null);

  const overlayVideos = () =>
    [modelRefOverlay.current, myRefOverlay.current].filter((v): v is HTMLVideoElement => v !== null);

  const handlePlayAll = async () => {
    setPlayError(null);
    const results = await Promise.allSettled(overlayVideos().map((v) => v.play()));
    if (results.some((r) => r.status === "rejected")) {
      setPlayError("動画の再生に失敗しました。動画の読み込みが終わってから、もう一度お試しください。");
    }
  };

  const handlePauseAll = () => {
    overlayVideos().forEach((v) => v.pause());
  };

  const handleResetAll = () => {
    overlayVideos().forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
  };

  const bothReady = modelUrl && myUrl;

  return (
    <Container maxW="960px" px={{ base: "4", md: "6" }} py="8">
      <PageHeader
        emoji="🎥"
        frenchSubtitle="Comparer et progresser"
        title="動画比較"
        description="お手本動画と自分の練習動画をアップロードして、左右で見比べたり、重ね合わせてフォームの違いを確認できます。"
      />

      {/* 動画アップロード */}
      <SimpleGrid columns={columns} gap="5" mb="8">
        <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="5" boxShadow="sm">
          <Text fontSize="xs" fontWeight="700" color="pink.700" mb="2">
            お手本動画
          </Text>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => handleModelFile(e.target.files?.[0] ?? null)}
            borderColor="pink.200"
            mb="3"
            size="sm"
          />
          <Box borderRadius="lg" overflow="hidden" bg="gray.100" aspectRatio={9 / 16} maxH="480px">
            {modelUrl ? (
              <video src={modelUrl} controls playsInline style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <Stack align="center" justify="center" h="100%">
                <Text fontSize="xs" color="gray.400">
                  動画ファイルを選択してください
                </Text>
              </Stack>
            )}
          </Box>
        </Box>

        <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="5" boxShadow="sm">
          <Text fontSize="xs" fontWeight="700" color="pink.700" mb="2">
            自分の動画
          </Text>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => handleMyFile(e.target.files?.[0] ?? null)}
            borderColor="pink.200"
            mb="3"
            size="sm"
          />
          <Box borderRadius="lg" overflow="hidden" bg="gray.100" aspectRatio={9 / 16} maxH="480px">
            {myUrl ? (
              <video src={myUrl} controls playsInline style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <Stack align="center" justify="center" h="100%">
                <Text fontSize="xs" color="gray.400">
                  動画ファイルを選択してください
                </Text>
              </Stack>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      {/* 重ね合わせ比較 */}
      <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="5" boxShadow="sm">
        <Text fontSize="xs" fontWeight="700" color="pink.700" mb="2">
          重ね合わせて比較
        </Text>

        {!bothReady && (
          <Text fontSize="sm" color="gray.500" py="6" textAlign="center">
            お手本動画と自分の動画を両方アップロードすると、重ね合わせて比較できます。
          </Text>
        )}

        {bothReady && (
          <>
            <Box
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              bg="black"
              aspectRatio={9 / 16}
              maxH="560px"
              mx="auto"
              maxW="320px"
            >
              <video
                ref={modelRefOverlay}
                src={modelUrl!}
                playsInline
                muted
                controls
                preload="auto"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
              />
              <video
                ref={myRefOverlay}
                src={myUrl!}
                playsInline
                muted
                preload="auto"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: opacity / 100,
                  mixBlendMode: blend,
                  pointerEvents: "none",
                }}
              />
              <Box
                position="absolute"
                top="2"
                left="2"
                bg="blackAlpha.700"
                color="white"
                fontSize="10px"
                px="2"
                py="0.5"
                borderRadius="full"
                pointerEvents="none"
              >
                お手本
              </Box>
              <Box
                position="absolute"
                top="2"
                right="2"
                bg="pink.600"
                color="white"
                fontSize="10px"
                px="2"
                py="0.5"
                borderRadius="full"
                opacity={opacity / 100}
                pointerEvents="none"
              >
                自分（{opacity}%）
              </Box>
            </Box>

            <Stack gap="4" mt="5">
              {playError && (
                <Text fontSize="xs" color="red.500" textAlign="center">
                  {playError}
                </Text>
              )}
              <HStack justify="center" gap="3">
                <Button size="sm" colorPalette="pink" onClick={handlePlayAll}>
                  同時に再生
                </Button>
                <Button size="sm" variant="outline" colorPalette="pink" onClick={handlePauseAll}>
                  一時停止
                </Button>
                <Button size="sm" variant="ghost" colorPalette="pink" onClick={handleResetAll}>
                  最初に戻す
                </Button>
              </HStack>

              <Box maxW="360px" mx="auto" w="100%">
                <Text fontSize="xs" color="gray.600" mb="1">
                  自分の動画の透明度：{opacity}%
                </Text>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </Box>

              <HStack justify="center" gap="2">
                <Button
                  size="xs"
                  variant={blend === "normal" ? "solid" : "outline"}
                  colorPalette="pink"
                  onClick={() => setBlend("normal")}
                >
                  通常表示
                </Button>
                <Button
                  size="xs"
                  variant={blend === "difference" ? "solid" : "outline"}
                  colorPalette="pink"
                  onClick={() => setBlend("difference")}
                >
                  差分表示（ズレが強調される）
                </Button>
              </HStack>

              <Text fontSize="xs" color="gray.400" textAlign="center">
                「最初に戻す」を押してから「同時に再生」を押すと、2本の動画が同じタイミングで再生されます。重ね合わせ表示は音声なしで再生されます（音を聞きたい場合は、上のプレビュー動画を個別に再生してください）。
              </Text>
            </Stack>
          </>
        )}
      </Box>
    </Container>
  );
}
