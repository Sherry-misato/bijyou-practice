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
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { fetchTodos, createTodo, updateTodo, deleteTodo, Todo } from "../lib/api";
import Ornament from "../components/Ornament";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadTodos = () => {
    setLoading(true);
    setError(null);
    fetchTodos()
      .then(setTodos)
      .catch(() => setError("TODOの読み込みに失敗しました。"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (submitting || !content.trim()) return;
    setSubmitting(true);
    try {
      await createTodo(content);
      setContent("");
      loadTodos();
    } catch {
      setError("TODOの追加に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    if (busyId !== null) return;
    setBusyId(todo.id);
    try {
      await updateTodo(todo.id, { done: !todo.done });
      loadTodos();
    } catch {
      setError("更新に失敗しました。");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (busyId !== null) return;
    if (!window.confirm("このTODOを削除しますか？")) return;
    setBusyId(id);
    try {
      await deleteTodo(id);
      loadTodos();
    } catch {
      setError("削除に失敗しました。");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Container maxW="640px" px={{ base: "4", md: "6" }} py="8">
      <Stack gap="2" mb="6">
        <Heading className="font-display" fontSize={{ base: "3xl", md: "4xl" }} color="pink.700">
          TODO
        </Heading>
        <Ornament />
        <Text color="gray.600" fontSize="sm">
          次回の練習で意識したい課題を管理しましょう。
        </Text>
      </Stack>

      <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="5" boxShadow="sm" mb="8">
        <HStack>
          <Input
            placeholder="例：ピルエットで軸をまっすぐにする"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            borderColor="pink.200"
          />
          <Button colorPalette="pink" onClick={handleAdd} loading={submitting} disabled={!content.trim()}>
            追加
          </Button>
        </HStack>
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
      ) : todos.length === 0 ? (
        <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            まだTODOがありません。次回の課題を追加してみましょう。
          </Text>
        </Box>
      ) : (
        <Stack gap="3">
          {todos.map((todo) => (
            <HStack
              key={todo.id}
              bg="white"
              borderWidth="1px"
              borderColor="pink.100"
              borderRadius="xl"
              p="4"
              boxShadow="sm"
              justify="space-between"
            >
              <HStack gap="3">
                <Checkbox.Root
                  checked={todo.done}
                  onCheckedChange={() => handleToggle(todo)}
                  colorPalette="pink"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
                <Text
                  fontSize="sm"
                  color={todo.done ? "gray.400" : "gray.700"}
                  textDecoration={todo.done ? "line-through" : "none"}
                >
                  {todo.content}
                </Text>
              </HStack>
              <Button
                size="xs"
                variant="ghost"
                colorPalette="pink"
                onClick={() => handleDelete(todo.id)}
                loading={busyId === todo.id}
              >
                削除
              </Button>
            </HStack>
          ))}
        </Stack>
      )}
    </Container>
  );
}
