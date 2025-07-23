import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Header() {
  const userName = "João Victor";
  const userPhotoUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ py: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <SchoolIcon
            sx={{
              color: "white",
              fontSize: { xs: 28, md: 36 },
              mr: 1,
            }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: "white",
              display: { xs: "none", sm: "block" },
            }}
          >
            FlipLearn
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Avatar
              alt={userName}
              src={userPhotoUrl}
              sx={{
                width: { xs: 36, md: 48 },
                height: { xs: 36, md: 48 },
                mr: 1.5,
                border: "3px solid white",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              {!userPhotoUrl && (
                <AccountCircleIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
              )}
            </Avatar>
            <Typography
              variant="body1"
              component="span"
              sx={{
                fontWeight: "medium",
                color: "white",
                display: { xs: "none", sm: "block" },
              }}
            >
              {userName}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
