
export interface Correlation {
  id: string;
  user_id: string;
  domain_a: string;
  domain_b: string;
  metric_a: string;
  metric_b: string;
  correlation_coefficient: number;
  significance_level: number;
  sample_size: number;
  discovered_at: string;
  last_updated: string;
  metadata: Record<string, any>;
}

export interface CrossDomainInsight {
  id: string;
  user_id: string;
  insight_type: 'correlation' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence_score: number;
  data_sources: string[];
  actionable_recommendations: string[];
  created_at: string;
}

export interface FeedbackLoop {
  id: string;
  user_id: string;
  loop_type: 'daily' | 'weekly' | 'monthly';
  trigger_conditions: Record<string, any>;
  actions: Record<string, any>;
  last_executed: string;
  success_rate: number;
  is_active: boolean;
}
