import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  const handleProtectedNavigation = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Report Issue", path: "/report", requireAuth: true },
    { name: "Collections", path: "/collections" },
    { name: "Admin", path: "/admin", requireAdmin: true },
    { name: "Users", path: "/users", requireAdmin: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.requireAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-primary-600 text-xl font-bold">WasteFix</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {filteredNavItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => handleProtectedNavigation(item.path, item.requireAuth || false)}
              >
                {item.name}
              </Button>
            ))}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm text-gray-600">
                    {userEmail}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {filteredNavItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        handleProtectedNavigation(item.path, item.requireAuth || false);
                        setIsOpen(false);
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                  {isAuthenticated ? (
                    <div className="pt-4 border-t mt-4">
                      <p className="text-sm text-gray-600 mb-2">{userEmail}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/settings")}
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t mt-4">
                      <Link to="/login" className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;