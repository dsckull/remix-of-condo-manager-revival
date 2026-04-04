import {
  LayoutDashboard, Users, Package, UserCheck, AlertTriangle,
  DollarSign, CalendarDays, BookOpen, Scale, ShieldAlert, MessageSquare
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';

const menuGroups = [
  {
    label: 'Principal',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Portaria',
    items: [
      { title: 'Moradores', url: '/moradores', icon: Users },
      { title: 'Encomendas', url: '/encomendas', icon: Package },
      { title: 'Visitantes', url: '/visitantes', icon: UserCheck },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { title: 'Ocorrências', url: '/ocorrencias', icon: AlertTriangle },
      { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
      { title: 'Assembleias', url: '/assembleias', icon: CalendarDays },
      { title: 'Reservas', url: '/reservas', icon: BookOpen },
    ],
  },
  {
    label: 'Segurança & Jurídico',
    items: [
      { title: 'Jurídico', url: '/juridico', icon: Scale },
      { title: 'DefCom', url: '/defcom', icon: ShieldAlert },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} defaultOpen>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
              {!collapsed && group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent'
                          }`}
                          activeClassName=""
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="text-sm">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
