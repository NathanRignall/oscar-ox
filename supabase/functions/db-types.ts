export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          inserted_at: string
          title: string
          updated_at: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          id?: string
          inserted_at?: string
          title?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          description: string
          id: string
          inserted_at: string
          is_public: boolean
          main_colour: string
          name: string
          slug: string
          theme: Database["public"]["Enums"]["page_theme"]
          updated_at: string
        }
        Insert: {
          description: string
          id?: string
          inserted_at?: string
          is_public?: boolean
          main_colour?: string
          name: string
          slug: string
          theme?: Database["public"]["Enums"]["page_theme"]
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          inserted_at?: string
          is_public?: boolean
          main_colour?: string
          name?: string
          slug?: string
          theme?: Database["public"]["Enums"]["page_theme"]
          updated_at?: string
        }
      }
      company_members: {
        Row: {
          company_id: string
          inserted_at: string
          profile_id: string
          role: Database["public"]["Enums"]["company_role"]
          updated_at: string
        }
        Insert: {
          company_id: string
          inserted_at?: string
          profile_id: string
          role?: Database["public"]["Enums"]["company_role"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          inserted_at?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["company_role"]
          updated_at?: string
        }
      }
      events: {
        Row: {
          end_time: string | null
          id: string
          inserted_at: string
          production_id: string
          start_time: string
          ticket_link: string | null
          updated_at: string
          venue_id: string
        }
        Insert: {
          end_time?: string | null
          id?: string
          inserted_at?: string
          production_id: string
          start_time: string
          ticket_link?: string | null
          updated_at?: string
          venue_id: string
        }
        Update: {
          end_time?: string | null
          id?: string
          inserted_at?: string
          production_id?: string
          start_time?: string
          ticket_link?: string | null
          updated_at?: string
          venue_id?: string
        }
      }
      pages: {
        Row: {
          company_id: string
          id: string
          inserted_at: string
          is_published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          id?: string
          inserted_at?: string
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          id?: string
          inserted_at?: string
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
      }
      participant_roles: {
        Row: {
          participant_id: string
          role_id: string
        }
        Insert: {
          participant_id: string
          role_id: string
        }
        Update: {
          participant_id?: string
          role_id?: string
        }
      }
      participants: {
        Row: {
          category_id: string | null
          id: string
          inserted_at: string
          production_id: string
          profile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          id?: string
          inserted_at?: string
          production_id: string
          profile_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          id?: string
          inserted_at?: string
          production_id?: string
          profile_id?: string
          title?: string
          updated_at?: string
        }
      }
      productions: {
        Row: {
          company_id: string
          description: string
          id: string
          inserted_at: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          description: string
          id?: string
          inserted_at?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          description?: string
          id?: string
          inserted_at?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          biography: string | null
          email: string
          family_name: string
          given_name: string
          id: string
          inserted_at: string
          is_public: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          biography?: string | null
          email: string
          family_name: string
          given_name: string
          id: string
          inserted_at?: string
          is_public?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          biography?: string | null
          email?: string
          family_name?: string
          given_name?: string
          id?: string
          inserted_at?: string
          is_public?: boolean
          updated_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          inserted_at: string
          is_accepted: boolean
          message: string
          profile_id: string
          updated_at: string
          vacancy_id: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          is_accepted: boolean
          message: string
          profile_id: string
          updated_at?: string
          vacancy_id: string
        }
        Update: {
          id?: string
          inserted_at?: string
          is_accepted?: boolean
          message?: string
          profile_id?: string
          updated_at?: string
          vacancy_id?: string
        }
      }
      roles: {
        Row: {
          description: string
          id: string
          image_url: string | null
          inserted_at: string
          is_published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          description: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          category_id: string
          inserted_at: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          inserted_at?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          inserted_at?: string
          profile_id?: string
          updated_at?: string
        }
      }
      vacancies: {
        Row: {
          company_id: string
          content: string | null
          id: string
          inserted_at: string
          is_open: boolean
          is_published: boolean
          production_id: string | null
          response_deadline: string | null
          response_type: Database["public"]["Enums"]["response_type"]
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content?: string | null
          id?: string
          inserted_at?: string
          is_open?: boolean
          is_published?: boolean
          production_id?: string | null
          response_deadline?: string | null
          response_type?: Database["public"]["Enums"]["response_type"]
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string | null
          id?: string
          inserted_at?: string
          is_open?: boolean
          is_published?: boolean
          production_id?: string | null
          response_deadline?: string | null
          response_type?: Database["public"]["Enums"]["response_type"]
          title?: string
          updated_at?: string
        }
      }
      vacancy_categories: {
        Row: {
          category_id: string
          vacancy_id: string
        }
        Insert: {
          category_id: string
          vacancy_id: string
        }
        Update: {
          category_id?: string
          vacancy_id?: string
        }
      }
      venues: {
        Row: {
          description: string
          id: string
          image_url: string | null
          inserted_at: string
          is_published: boolean
          is_useradded: boolean
          latitude: number
          location: string
          longitude: number
          slug: string
          title: string
          updated_at: string
          website: string | null
        }
        Insert: {
          description: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          is_published?: boolean
          is_useradded?: boolean
          latitude: number
          location: string
          longitude: number
          slug: string
          title: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          description?: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          is_published?: boolean
          is_useradded?: boolean
          latitude?: number
          location?: string
          longitude?: number
          slug?: string
          title?: string
          updated_at?: string
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_company_member: {
        Args: {
          company_id: string
          profile_id: string
          role: Database["public"]["Enums"]["company_role"]
        }
        Returns: boolean
      }
      authorize_company_participant_member: {
        Args: {
          participant_id: string
          profile_id: string
          role: Database["public"]["Enums"]["company_role"]
        }
        Returns: boolean
      }
      authorize_company_production_member: {
        Args: {
          production_id: string
          profile_id: string
          role: Database["public"]["Enums"]["company_role"]
        }
        Returns: boolean
      }
      authorize_company_public: {
        Args: {
          company_id: string
        }
        Returns: boolean
      }
      authorize_company_vacancy_member: {
        Args: {
          vacancy_id: string
          profile_id: string
          role: Database["public"]["Enums"]["company_role"]
        }
        Returns: boolean
      }
      authorize_participant_public: {
        Args: {
          participant_id: string
        }
        Returns: boolean
      }
      authorize_production_public: {
        Args: {
          production_id: string
        }
        Returns: boolean
      }
      authorize_vacancy_public: {
        Args: {
          vacancy_id: string
        }
        Returns: boolean
      }
      create_company: {
        Args: {
          slug: string
          name: string
          description: string
        }
        Returns: string
      }
      update_company: {
        Args: {
          id: string
          slug: string
          name: string
          description: string
          main_colour: string
          is_public: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      company_role: "admin" | "moderator"
      page_theme: "default" | "00productions"
      response_type: "platform" | "email" | "phone"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

