"use client";

import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { fetchPasList, Pas } from "./lib/api";

export default function HomePage() {
  const [pasList, setPasList] = useState<Pas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Container maxW="960px" px={{ base: "4", md: "6" }} py="8">
      <Stack gap="2" mb="8">
        <Heading className="font-display" fontSize={{ base: "3xl", md: "4xl" }} color="pink.700">
          パ辞書
        </Heading>
        <Text color="gray.600" fontSize="sm">
          バレエのパ（技）の意味・動き方・注意点をいつでも確認できます。気になるパを選んで、お手本動画もチェックしましょう。
        </Text>
      </Stack>

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

      {!loading && !error && pasList.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
          {pasList.map((pas) => (
            <Box
              key={pas.id}
              bg="white"
              borderWidth="1px"
              borderColor="pink.100"
              borderRadius="xl"
              p="6"
              boxShadow="sm"
            >
              <Stack gap="1" mb="3">
                <Heading className="font-display" fontSize="xl" fontStyle="italic" color="pink.700">
                  {pas.french}
                </Heading>
                <Badge colorPalette="pink" borderRadius="full" w="fit-content" px="3">
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
                <Text>
                  <Text as="span" fontWeight="700" color="pink.700">
                    使用場面：
                  </Text>
                  {pas.used_scene}
                </Text>
              </Stack>

              {pas.sample_video_url && (
                <Box mt="4">
                  <Text fontSize="xs" fontWeight="700" color="pink.700" mb="2">
                    お手本動画
                  </Text>
                  <AspectRatio ratio={16 / 9} borderRadius="lg" overflow="hidden">
                    <iframe
                      src={pas.sample_video_url}
                      title={`${pas.french} お手本動画`}
                      allowFullScreen
                    />
                  </AspectRatio>
                </Box>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
