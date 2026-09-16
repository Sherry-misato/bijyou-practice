"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";

const NAV_ITEMS = [
  { label: "パ辞書", href: "/" },
  { label: "レッスン日記", href: "/logs" },
  { label: "TODO", href: "/todo" },
  { label: "クイズ", href: "/quiz" },
  { label: "動画比較", href: "/compare" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      bg="white"
      borderBottomWidth="1px"
      borderColor="pink.100"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Flex
        maxW="960px"
        mx="auto"
        px={{ base: "4", md: "6" }}
        py="3"
        align="center"
        justify="space-between"
        wrap="wrap"
        gap="3"
      >
        <NextLink href="/">
          <Text
            className="font-display"
            fontSize="2xl"
            fontStyle="italic"
            fontWeight="600"
            color="pink.600"
          >
            bijyou
          </Text>
        </NextLink>

        <HStack gap={{ base: "3", md: "6" }} wrap="wrap">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <NextLink key={item.href} href={item.href}>
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? "700" : "500"}
                  color={isActive ? "pink.700" : "gray.600"}
                  borderBottomWidth="2px"
                  borderColor={isActive ? "pink.400" : "transparent"}
                  pb="1"
                  _hover={{ color: "pink.600" }}
                  transition="color 0.15s ease"
                >
                  {item.label}
                </Text>
              </NextLink>
            );
          })}
        </HStack>
      </Flex>
    </Box>
  );
}
