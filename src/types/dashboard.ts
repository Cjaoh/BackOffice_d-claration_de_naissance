export interface DashboardStats {
  totalDeclarations: number;
  activeUsers: number;
  pendingDeclarations: number;
  approvedDeclarations: number;
}

export interface RecentDeclaration {
  id: string;
  name: string;
  date: string;
  status: string;
  type: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentDeclarations: RecentDeclaration[];
}