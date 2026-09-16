"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text, SimpleGrid, Stack, HStack, Button, Input } from "@chakra-ui/react";

type Props = {
  modelVideoUrl: string | null;
  pasName: string;
};

const isEmbedUrl = (url: string) => url.includes("/embed/");

export default function PasVideoCompare({ modelVideoUrl, pasName }: Props) {
  const [myUrl, setMyUrl] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [opacity, setOpacity] = useState(50);

  useEffect(() => {
    return () => {
      if (myUrl) URL.revokeObjectURL(myUrl);
    };
  }, [myUrl]);

  const handleMyFile = (file: File | null) => {
    if (!file) return;
    setMyUrl(URL.createObjectURL(file));
  };

  const modelOverlayRef = useRef<HTMLVideoElement>(null);
  const myOverlayRef = useRef<HTMLVideoElement>(null);

  const handlePlayAll = () => {
    modelOverlayRef.current?.play().catch(() => {});
    myOverlayRef.current?.play().catch(() => {});
  };
  const handlePauseAll = () => {
    modelOverlayRef.current?.pause();
    myOverlayRef.current?.pause();
  };
  const handleResetAll = () => {
    [modelOverlayRef.current, myOverlayRef.current].forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
  };

  return (
    <Box mt="4">
      <HStack mb="2" gap="2">
        <Box w="16px" h="1px" bg="#C9A66B" />
        <Text fontSize="xs" fontWeight="700" color="pink.700" letterSpacing="0.05em">
          お手本動画 ／ 自分の動画
        </Text>
      </HStack>

      <SimpleGrid columns={2} gap="2">
        {/* お手本 */}
        <Box>
          <Text fontSize="10px" color="gray.500" mb="1">
            お手本
          </Text>
          {modelVideoUrl ? (
            <Box borderRadius="lg" overflow="hidden" aspectRatio={3 / 4} bg="black">
              {isEmbedUrl(modelVideoUrl) ? (
                <iframe src={modelVideoUrl} title={`${pasName} お手本動画`} allowFullScreen style={{ width: "100%", height: "100%" }} />
              ) : (
                <video src={modelVideoUrl} controls playsInline style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              )}
            </Box>
          ) : (
            <Box borderRadius="lg" aspectRatio={3 / 4} bg="gray.100" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="10px" color="gray.400" textAlign="center" px="2">
                未登録
              </Text>
            </Box>
          )}
        </Box>

        {/* 自分の動画 */}
        <Box>
          <Text fontSize="10px" color="gray.500" mb="1">
            自分（比較用）
          </Text>
          {myUrl ? (
            <Box borderRadius="lg" overflow="hidden" aspectRatio={3 / 4} bg="black">
              <video src={myUrl} controls playsInline style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Box>
          ) : (
            <Box
              borderRadius="lg"
              aspectRatio={3 / 4}
              bg="pink.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth="1px"
              borderColor="pink.200"
              borderStyle="dashed"
            >
              <Text fontSize="10px" color="pink.400" textAlign="center" px="2">
                自分の動画を
                <br />
                アップロード
              </Text>
            </Box>
          )}
          <Input
            type="file"
            accept="video/*"
            size="xs"
            fontSize="10px"
            mt="1"
            borderColor="pink.200"
            onChange={(e) => handleMyFile(e.target.files?.[0] ?? null)}
          />
        </Box>
      </SimpleGrid>

      {/* 重ね合わせ比較（両方揃ったら表示） */}
      {modelVideoUrl && !isEmbedUrl(modelVideoUrl) && myUrl && (
        <Box mt="3">
          <Button
            size="xs"
            variant="ghost"
            colorPalette="pink"
            px="0"
            fontWeight="600"
            onClick={() => setShowOverlay((v) => !v)}
          >
            {showOverlay ? "重ね合わせを閉じる ▲" : "重ねて比較する ▼"}
          </Button>

          {showOverlay && (
            <Stack gap="3" mt="2">
              <Box position="relative" borderRadius="lg" overflow="hidden" bg="black" aspectRatio={3 / 4}>
                <video
                  ref={modelOverlayRef}
                  src={modelVideoUrl}
                  playsInline
                  muted
                  controls
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
                />
                <video
                  ref={myOverlayRef}
                  src={myUrl}
                  playsInline
                  muted
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    opacity: opacity / 100,
                    pointerEvents: "none",
                  }}
                />
              </Box>

              <HStack justify="center" gap="2">
                <Button size="xs" colorPalette="pink" onClick={handlePlayAll}>
                  同時に再生
                </Button>
                <Button size="xs" variant="outline" colorPalette="pink" onClick={handlePauseAll}>
                  一時停止
                </Button>
                <Button size="xs" variant="ghost" colorPalette="pink" onClick={handleResetAll}>
                  最初に戻す
                </Button>
              </HStack>

              <Box>
                <Text fontSize="10px" color="gray.600" mb="1">
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
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}
