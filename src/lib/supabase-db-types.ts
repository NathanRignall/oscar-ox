export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          inserted_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          inserted_at?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          inserted_at?: string;
          title?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          description: string;
          id: string;
          inserted_at: string;
          main_colour: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          description: string;
          id: string;
          inserted_at?: string;
          main_colour?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          description?: string;
          id?: string;
          inserted_at?: string;
          main_colour?: string;
          name?: string;
          updated_at?: string;
        };
      };
      company_members: {
        Row: {
          company_id: string;
          id: string;
          inserted_at: string;
          profile_id: string;
          role: Database["public"]["Enums"]["company_role"];
          updated_at: string;
        };
        Insert: {
          company_id: string;
          id: string;
          inserted_at?: string;
          profile_id: string;
          role?: Database["public"]["Enums"]["company_role"];
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          id?: string;
          inserted_at?: string;
          profile_id?: string;
          role?: Database["public"]["Enums"]["company_role"];
          updated_at?: string;
        };
      };
      events: {
        Row: {
          end_time: string | null;
          id: string;
          inserted_at: string;
          is_published: boolean;
          production_id: string;
          start_time: string;
          ticket_link: string | null;
          updated_at: string;
          venue_id: string;
        };
        Insert: {
          end_time?: string | null;
          id: string;
          inserted_at?: string;
          is_published?: boolean;
          production_id: string;
          start_time: string;
          ticket_link?: string | null;
          updated_at?: string;
          venue_id: string;
        };
        Update: {
          end_time?: string | null;
          id?: string;
          inserted_at?: string;
          is_published?: boolean;
          production_id?: string;
          start_time?: string;
          ticket_link?: string | null;
          updated_at?: string;
          venue_id?: string;
        };
      };
      pages: {
        Row: {
          company_id: string;
          content: string;
          id: string;
          inserted_at: string;
          is_published: boolean;
          title: string;
          updated_at: string;
          url: string;
        };
        Insert: {
          company_id: string;
          content: string;
          id: string;
          inserted_at?: string;
          is_published: boolean;
          title: string;
          updated_at?: string;
          url: string;
        };
        Update: {
          company_id?: string;
          content?: string;
          id?: string;
          inserted_at?: string;
          is_published?: boolean;
          title?: string;
          updated_at?: string;
          url?: string;
        };
      };
      participants: {
        Row: {
          category_id: string | null;
          inserted_at: string;
          production_id: string;
          profile_id: string;
          role_id: string | null;
          updated_at: string;
          uuid: string;
        };
        Insert: {
          category_id?: string | null;
          inserted_at?: string;
          production_id: string;
          profile_id: string;
          role_id?: string | null;
          updated_at?: string;
          uuid: string;
        };
        Update: {
          category_id?: string | null;
          inserted_at?: string;
          production_id?: string;
          profile_id?: string;
          role_id?: string | null;
          updated_at?: string;
          uuid?: string;
        };
      };
      productions: {
        Row: {
          company_id: string;
          description: string;
          id: string;
          inserted_at: string;
          is_published: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          description: string;
          id: string;
          inserted_at?: string;
          is_published?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          description?: string;
          id?: string;
          inserted_at?: string;
          is_published?: boolean;
          title?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          biography: string | null;
          email: string;
          id: string;
          inserted_at: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          biography?: string | null;
          email: string;
          id: string;
          inserted_at?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          biography?: string | null;
          email?: string;
          id?: string;
          inserted_at?: string;
          name?: string;
          updated_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          inserted_at: string;
          is_accepted: boolean;
          message: string;
          profile_id: string;
          updated_at: string;
          vacancy_id: string;
        };
        Insert: {
          id: string;
          inserted_at?: string;
          is_accepted: boolean;
          message: string;
          profile_id: string;
          updated_at?: string;
          vacancy_id: string;
        };
        Update: {
          id?: string;
          inserted_at?: string;
          is_accepted?: boolean;
          message?: string;
          profile_id?: string;
          updated_at?: string;
          vacancy_id?: string;
        };
      };
      roles: {
        Row: {
          description: string;
          id: string;
          image_url: string | null;
          inserted_at: string;
          is_published: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          description: string;
          id: string;
          image_url?: string | null;
          inserted_at?: string;
          is_published?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          description?: string;
          id?: string;
          image_url?: string | null;
          inserted_at?: string;
          is_published?: boolean;
          title?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          category_id: string;
          id: string;
          inserted_at: string;
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          id: string;
          inserted_at?: string;
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          id?: string;
          inserted_at?: string;
          profile_id?: string;
          updated_at?: string;
        };
      };
      vacancies: {
        Row: {
          company_id: string;
          description: string;
          id: string;
          inserted_at: string;
          is_open: boolean;
          is_published: boolean;
          production_id: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          description: string;
          id: string;
          inserted_at?: string;
          is_open?: boolean;
          is_published?: boolean;
          production_id?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          description?: string;
          id?: string;
          inserted_at?: string;
          is_open?: boolean;
          is_published?: boolean;
          production_id?: string | null;
          title?: string;
          updated_at?: string;
        };
      };
      vacancy_categories: {
        Row: {
          category_id: string;
          id: string;
          vacancy_id: string;
        };
        Insert: {
          category_id: string;
          id: string;
          vacancy_id: string;
        };
        Update: {
          category_id?: string;
          id?: string;
          vacancy_id?: string;
        };
      };
      venues: {
        Row: {
          description: string;
          id: string;
          image_url: string | null;
          inserted_at: string;
          is_published: boolean;
          is_useradded: boolean;
          location: string;
          title: string;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          description: string;
          id: string;
          image_url?: string | null;
          inserted_at?: string;
          is_published?: boolean;
          is_useradded?: boolean;
          location: string;
          title: string;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          description?: string;
          id?: string;
          image_url?: string | null;
          inserted_at?: string;
          is_published?: boolean;
          is_useradded?: boolean;
          location?: string;
          title?: string;
          updated_at?: string;
          website?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      company_role: "admin" | "moderator";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
