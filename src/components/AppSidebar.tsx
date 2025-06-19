
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  Calendar,
  Target,
  Lightbulb,
  FolderOpen,
  Clock,
  Heart,
  Building2,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';

const items = [
  {
    title: 'Overview',
    url: 'overview',
    icon: BarChart3,
  },
  {
    title: 'Pillars',
    url: 'pillars',
    icon: Building2,
  },
  {
    title: 'Goals',
    url: 'goals',
    icon: Target,
  },
  {
    title: 'Projects',
    url: 'projects',
    icon: FolderOpen,
  },
  {
    title: 'Tasks',
    url: 'tasks',
    icon: CheckSquare,
  },
  {
    title: 'Habits',
    url: 'habits',
    icon: Clock,
  },
  {
    title: 'Journal',
    url: 'journals',
    icon: BookOpen,
  },
  {
    title: 'Knowledge',
    url: 'knowledge',
    icon: Lightbulb,
  },
  {
    title: 'Reviews',
    url: 'reviews',
    icon: Calendar,
  },
  {
    title: 'Values',
    url: 'values',
    icon: Heart,
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: Settings,
  },
];

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showHelp: boolean;
  toggleHelp: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

export function AppSidebar({ 
  activeTab, 
  setActiveTab, 
  showHelp,
  toggleHelp,
  onSignOut, 
  userEmail 
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Life OS</span>
            <span className="truncate text-xs text-muted-foreground">
              Personal System
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.url)}
                    isActive={activeTab === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1 text-sm">
              <User className="h-4 w-4" />
              <span className="truncate text-muted-foreground">
                {userEmail}
              </span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleHelp}>
              <HelpCircle className="h-4 w-4" />
              <span>{showHelp ? 'Hide Help' : 'Show Help'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeSwitcher />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
