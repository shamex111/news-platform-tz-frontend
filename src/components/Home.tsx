import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NewsList } from "../components/NewsList";

const Home:React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
  
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1">
              Последние новости
            </Typography>
            {!isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/register")}
              >
                Зарегистрироваться
              </Button>
            )}
          </Box>
  
          <NewsList />
        </Box>
      </Container>
    );
}

export default Home