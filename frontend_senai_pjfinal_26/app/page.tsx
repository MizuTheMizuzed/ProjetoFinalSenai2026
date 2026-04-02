"use client";

import {
  AccountBalance,
  ArrowDownward,
  ArrowUpward,
  CreditCard,
  Notifications,
  ReceiptLong,
  Settings,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

// ---------------------------------------------------------------------------
// Dados fictícios
// ---------------------------------------------------------------------------

const user = {
  name: "Alessandro Munhoz Schwamborn",
  accountNumber: "0001 · 12345-6",
  avatarUrl: "",
};

const balance = {
  available: 72_480.75,
  invested: 34_200.0,
  limit: 5_000.0,
};

const transactions: {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
}[] = [
  {
    id: 1,
    description: "Salário",
    category: "Receita",
    amount: 8500.0,
    date: "24 mar",
    type: "credit",
  },
  {
    id: 2,
    description: "Supermercado Extra",
    category: "Alimentação",
    amount: -347.9,
    date: "23 mar",
    type: "debit",
  },
  {
    id: 3,
    description: "Netflix",
    category: "Entretenimento",
    amount: -55.9,
    date: "22 mar",
    type: "debit",
  },
  {
    id: 4,
    description: "Transferência recebida",
    category: "Transferência",
    amount: 1200.0,
    date: "21 mar",
    type: "credit",
  },
  {
    id: 5,
    description: "Conta de luz",
    category: "Utilidades",
    amount: -189.4,
    date: "20 mar",
    type: "debit",
  },
  {
    id: 6,
    description: "Farmácia",
    category: "Saúde",
    amount: -92.0,
    date: "19 mar",
    type: "debit",
  },
 
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

// ---------------------------------------------------------------------------
// Componentes internos
// ---------------------------------------------------------------------------

function BalanceCard() {
  return (
    <Card
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%)",
        color: "#fff",
        borderRadius: 3,
        p: 1,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <AccountBalance fontSize="small" sx={{ opacity: 0.8 }} />
            <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 1 }}>
              CONTA CORRENTE · {user.accountNumber}
            </Typography>
          </Stack>
          <Chip
            label="Ativa"
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
        </Stack>

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Saldo disponível
        </Typography>
        <Typography variant="h3" fontWeight={700} letterSpacing={-1} mb={3}>
          {formatCurrency(balance.available)}
        </Typography>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

        <Stack direction="row" gap={4}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Investido
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(balance.invested)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Limite disponível
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(balance.limit)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    { icon: <ArrowUpward />, label: "Transferir" },
    { icon: <CreditCard />, label: "Cartão" },
    { icon: <TrendingUp />, label: "Investir" },
  ];

  return (
    <Stack direction="row" justifyContent="space-between">
      {actions.map((action) => (
        <Stack key={action.label} alignItems="center" gap={0.5}>
          <IconButton
            sx={{
              bgcolor: "#f0f4ff",
              color: "#1a237e",
              width: 56,
              height: 56,
              "&:hover": { bgcolor: "#dce4ff" },
            }}
          >
            {action.icon}
          </IconButton>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {action.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function TransactionList() {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8eaf6" }}>
      <CardContent sx={{ pb: "16px !important" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <ReceiptLong fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight={700}>
              Transações recentes
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            color="primary"
            fontWeight={600}
            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          >
            Ver todas
          </Typography>
        </Stack>

        <List disablePadding>
          {transactions.map((tx, index) => (
            <Box key={tx.id}>
              <ListItem disablePadding sx={{ py: 1.2 }}>
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: tx.type === "credit" ? "#e8f5e9" : "#fce4ec",
                      color: tx.type === "credit" ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownward fontSize="small" />
                    ) : (
                      <ArrowUpward fontSize="small" />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      {tx.description}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {tx.category} · {tx.date}
                    </Typography>
                  }
                />
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={tx.type === "credit" ? "success.main" : "error.main"}
                >
                  {tx.type === "credit" ? "+" : ""}
                  {formatCurrency(tx.amount)}
                </Typography>
              </ListItem>
              {index < transactions.length - 1 && (
                <Divider variant="inset" component="li" sx={{ ml: 6 }} />
              )}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #e8eaf6",
          px: { xs: 2, sm: 4 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <AccountBalance sx={{ color: "#1a237e", fontSize: 28 }} />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: "#1a237e", letterSpacing: -0.5 }}
          >
            Banco Master
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton size="small">
            <Notifications fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <Settings fontSize="small" />
          </IconButton>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#1a237e",
              fontSize: "0.8rem",
              fontWeight: 700,
              ml: 0.5,
            }}
          >
            {getInitials(user.name)}
          </Avatar>
        </Stack>
      </Box>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 480,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Saudação */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            {getGreeting()},
          </Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {user.name} 👋
          </Typography>
        </Box>

        {/* Card de saldo */}
        <BalanceCard />

        {/* Ações rápidas */}
        <QuickActions />

        {/* Transações recentes */}
        <TransactionList />
      </Box>
    </Box>
  );
}
