import {
  Button,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";

export default function Home() {
  const todos = [
    {
      _id: "1",
      title: "todo1",
      completed: false,
    },
    {
      _id: "2",
      title: "todo2",
      completed: false,
    },
    {
      _id: "3",
      title: "todo3",
      completed: true,
    },
  ];
  return (
    <div>
      <Container className="flex items-center justify-center h-screen">
        <Stack className="w-full" spacing={2}>
          <h1 className="text-2xl font-bold mb-2">Todo App</h1>
          <form>
            <div className="mb-2">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Todoを追加
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 p-2 mt-1"
              />
            </div>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Todoを追加
            </Button>
          </form>
          {todos
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <Stack
                className="px-2 flex justify-between border-2 border-black"
                direction="row"
                key={todo._id}
              >
                <FormControlLabel control={<Checkbox />} label={todo.title} />
                <div>
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </div>
              </Stack>
            ))}
          <Button variant="contained" color="error" type="submit" fullWidth>
            ログアウト
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
