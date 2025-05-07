import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { env } from "../config/env";
import { INews } from "../types/common";



export const NewsList: React.FC = () => {
  const [news, setNews] = useState<INews[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${env.API_URL}${env.API_ROUTES.NEWS.BASE}`
        );
        setNews(response.data);

        const uniqueAuthors = Array.from(
          new Set(response.data.map((item: INews) => item.author.email))
        ) as string[];
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesTitle = item.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());
    const matchesAuthor =
      authorFilter === "" || item.author.email === authorFilter;
    return matchesTitle && matchesAuthor;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Поиск по заголовку"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          sx={{ width: 300 }}
        />
        <TextField
          select
          label="Фильтр по автору"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          sx={{ width: 300 }}
        >
          <MenuItem value="">Все авторы</MenuItem>
          {authors.map((author) => (
            <MenuItem key={author} value={author}>
              {author}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredNews.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
              onClick={() => navigate(`/news/${item._id}`)}
            >
              {item.images && item.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={`${env.UPLOADS_URL}/${item.images[0]}`}
                  alt={item.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Автор: {item.author.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
