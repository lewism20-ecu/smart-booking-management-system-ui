import { useState } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  Link as RouterLink,
} from "react-router";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useColorMode } from "../../../app/ColorModeContext";
import { getStoredUser, clearSession } from "../../auth/utils/session";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

function getNavItems(role) {
  const all = [
    { label: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/dashboard" },
    {
      label: "My Bookings",
      icon: <CalendarTodayOutlinedIcon />,
      path: "/bookings",
    },
    { label: "Browse Venues", icon: <BusinessOutlinedIcon />, path: "/venues" },
  ];
  const managerAdmin = [
    {
      label: "Resources",
      icon: <MeetingRoomOutlinedIcon />,
      path: "/resources",
    },
    {
      label: "Approvals",
      icon: <CheckCircleOutlineIcon />,
      path: "/approvals",
    },
  ];
  const adminOnly = [
    { label: "Users", icon: <PeopleOutlineIcon />, path: "/users" },
    { label: "Reports", icon: <BarChartOutlinedIcon />, path: "/reports" },
  ];

  const items = [...all];
  if (role === "manager" || role === "admin") items.push(...managerAdmin);
  if (role === "admin") items.push(...adminOnly);
  return items;
}

function roleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "manager") return "Venue Manager";
  return "User";
}

function userInitials(email) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

// ──────────────────────────────────────────
// Sidebar inner content — must be top-level to avoid "component during render"
// ──────────────────────────────────────────
function SidebarContent({
  navItems,
  collapsed,
  isMobile,
  location,
  user,
  onNavClick,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Logo row */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: collapsed && !isMobile ? 1.5 : 2.5,
          gap: 1.5,
          flexShrink: 0,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2763f4 0%, #9131f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          <BusinessOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        {(!collapsed || isMobile) && (
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
              lineHeight: 1.2,
              background: "linear-gradient(90deg, #2763f4, #9131f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Smart Booking
          </Typography>
        )}
      </Box>

      {/* Nav items */}
      <Box
        sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", py: 1.5 }}
      >
        <List dense disablePadding>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <Tooltip
                  title={collapsed && !isMobile ? item.label : ""}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    onClick={onNavClick}
                    selected={active}
                    sx={{
                      borderRadius: "10px",
                      minHeight: 42,
                      px: collapsed && !isMobile ? 1.5 : 2,
                      justifyContent:
                        collapsed && !isMobile ? "center" : "flex-start",
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "#fff",
                        "& .MuiListItemIcon-root": { color: "#fff" },
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed && !isMobile ? 0 : 36,
                        color: active ? "inherit" : "text.secondary",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {(!collapsed || isMobile) && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User section at bottom */}
      <Divider />
      <Box
        sx={{
          p: collapsed && !isMobile ? 1 : 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minHeight: 72,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: 13,
            fontWeight: 700,
            background: "linear-gradient(135deg, #2763f4 0%, #9131f5 100%)",
            flexShrink: 0,
          }}
        >
          {userInitials(user?.email)}
        </Avatar>
        {(!collapsed || isMobile) && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1 }}
            >
              {roleLabel(user?.role)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ──────────────────────────────────────────
// Main layout shell
// ──────────────────────────────────────────
export default function DashboardLayout() {
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const navItems = getNavItems(user?.role);
  const sidebarWidth =
    collapsed && !isMobile ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const sidebarProps = {
    navItems,
    collapsed,
    isMobile,
    location,
    user,
    onNavClick: () => isMobile && setMobileOpen(false),
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: sidebarWidth,
              height: "100vh",
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              transition: "width 200ms ease",
              overflow: "hidden",
              zIndex: theme.zIndex.drawer,
            }}
          >
            <SidebarContent {...sidebarProps} />
          </Box>
        </Box>
      )}

      {/* Mobile temporary drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              bgcolor: "background.paper",
              backgroundImage: "none",
            },
          }}
        >
          <SidebarContent {...sidebarProps} />
        </Drawer>
      )}

      {/* Main area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            {/* Burger — mobile opens drawer, desktop collapses sidebar */}
            <IconButton
              aria-label="toggle navigation"
              onClick={() =>
                isMobile ? setMobileOpen(true) : setCollapsed((c) => !c)
              }
              edge="start"
              sx={{ color: "text.secondary" }}
            >
              <MenuIcon />
            </IconButton>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Dark mode toggle */}
            <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
              <IconButton
                onClick={toggleColorMode}
                sx={{ color: "text.secondary" }}
              >
                {mode === "light" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                sx={{ color: "text.secondary" }}
                onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              >
                <Badge badgeContent={1} color="error">
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User avatar + menu */}
            <Tooltip title="Account">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ p: 0, ml: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: 12,
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #2763f4 0%, #9131f5 100%)",
                  }}
                >
                  {userInitials(user?.email)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: { mt: 1, minWidth: 180, borderRadius: "12px" },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {roleLabel(user?.role)}
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  toggleColorMode();
                }}
                sx={{ fontSize: 14, gap: 1.5, py: 1.2 }}
              >
                {mode === "light" ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <LightModeOutlinedIcon fontSize="small" />
                )}
                {mode === "light" ? "Dark mode" : "Light mode"}
              </MenuItem>
              <MenuItem
                onClick={() => setAnchorEl(null)}
                sx={{ fontSize: 14, gap: 1.5, py: 1.2 }}
              >
                <SettingsOutlinedIcon fontSize="small" />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ fontSize: 14, gap: 1.5, py: 1.2, color: "error.main" }}
              >
                <LogoutOutlinedIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={() => setNotifAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: {
                    mt: 1,
                    width: 280,
                    borderRadius: "12px",
                    overflow: "hidden",
                  },
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Notifications
                </Typography>
              </Box>
              <MenuItem
                onClick={() => setNotifAnchorEl(null)}
                sx={{ py: 1.5, whiteSpace: "normal" }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    System Update
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Welcome to the Smart Booking Management System! Try booking
                    a resource.
                  </Typography>
                </Box>
              </MenuItem>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => setNotifAnchorEl(null)}
                >
                  Mark all as read
                </Typography>
              </Box>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 3, md: 4 },
            width: "100%",
            overflowX: "hidden",
            bgcolor: "background.default",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
