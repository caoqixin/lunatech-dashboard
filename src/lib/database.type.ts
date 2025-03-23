export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          brand_image: string | null;
          id: number;
          name: string;
        };
        Insert: {
          brand_image?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          brand_image?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      category_items: {
        Row: {
          categoryId: number;
          id: number;
          name: string;
        };
        Insert: {
          categoryId: number;
          id?: number;
          name: string;
        };
        Update: {
          categoryId?: number;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "category_items_categoryId_fkey";
            columns: ["categoryId"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      component_categories: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      components: {
        Row: {
          alias: string | null;
          brand: string;
          category: string;
          code: string | null;
          fts: unknown | null;
          id: number;
          model: string[] | null;
          name: string;
          public_price: number;
          purchase_price: number;
          quality: string;
          stock: number;
          supplier: string;
        };
        Insert: {
          alias?: string | null;
          brand: string;
          category: string;
          code?: string | null;
          fts?: unknown | null;
          id?: number;
          model?: string[] | null;
          name: string;
          public_price: number;
          purchase_price: number;
          quality?: string;
          stock: number;
          supplier: string;
        };
        Update: {
          alias?: string | null;
          brand?: string;
          category?: string;
          code?: string | null;
          fts?: unknown | null;
          id?: number;
          model?: string[] | null;
          name?: string;
          public_price?: number;
          purchase_price?: number;
          quality?: string;
          stock?: number;
          supplier?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          email: string | null;
          id: number;
          name: string;
          tel: string;
        };
        Insert: {
          email?: string | null;
          id?: number;
          name: string;
          tel: string;
        };
        Update: {
          email?: string | null;
          id?: number;
          name?: string;
          tel?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          category: string | null;
          code: string | null;
          componentId: number;
          count: number;
          id: number;
          name: string;
          order_id: string;
          public_price: string | null;
          purchase_price: string | null;
          status: string;
        };
        Insert: {
          category?: string | null;
          code?: string | null;
          componentId: number;
          count: number;
          id?: number;
          name: string;
          order_id: string;
          public_price?: string | null;
          purchase_price?: string | null;
          status?: string;
        };
        Update: {
          category?: string | null;
          code?: string | null;
          componentId?: number;
          count?: number;
          id?: number;
          name?: string;
          order_id?: string;
          public_price?: string | null;
          purchase_price?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          amount: number;
          createdAt: string;
          id: string;
          updatedAt: string;
        };
        Insert: {
          amount: number;
          createdAt?: string;
          id: string;
          updatedAt: string;
        };
        Update: {
          amount?: number;
          createdAt?: string;
          id?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      phones: {
        Row: {
          brandId: number;
          code: string | null;
          id: number;
          isTablet: boolean;
          name: string;
        };
        Insert: {
          brandId: number;
          code?: string | null;
          id?: number;
          isTablet: boolean;
          name: string;
        };
        Update: {
          brandId?: number;
          code?: string | null;
          id?: number;
          isTablet?: boolean;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "phones_brandId_fkey";
            columns: ["brandId"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      repair_problems: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      repairs: {
        Row: {
          createdAt: string;
          customerId: number;
          deposit: number;
          id: number;
          isRework: boolean;
          phone: string;
          price: number;
          problem: string[] | null;
          status: string;
          updatedAt: string;
        };
        Insert: {
          createdAt: string;
          customerId: number;
          deposit?: number;
          id?: number;
          isRework?: boolean;
          phone: string;
          price: number;
          problem?: string[] | null;
          status?: string;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          customerId?: number;
          deposit?: number;
          id?: number;
          isRework?: boolean;
          phone?: string;
          price?: number;
          problem?: string[] | null;
          status?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "repairs_customerId_fkey";
            columns: ["customerId"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      settings: {
        Row: {
          id: number;
          setting_name: string;
          setting_value: string;
        };
        Insert: {
          id?: number;
          setting_name: string;
          setting_value: string;
        };
        Update: {
          id?: number;
          setting_name?: string;
          setting_value?: string;
        };
        Relationships: [];
      };
      suppliers: {
        Row: {
          description: string | null;
          id: number;
          name: string;
          password: string | null;
          site: string | null;
          username: string | null;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name: string;
          password?: string | null;
          site?: string | null;
          username?: string | null;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
          password?: string | null;
          site?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      warranties: {
        Row: {
          createdAt: string;
          days: number | null;
          expiredAt: string | null;
          id: string;
          isRework: boolean;
          repairId: number;
          reworkCount: number;
        };
        Insert: {
          createdAt?: string;
          days?: number | null;
          expiredAt?: string | null;
          id: string;
          isRework?: boolean;
          repairId: number;
          reworkCount?: number;
        };
        Update: {
          createdAt?: string;
          days?: number | null;
          expiredAt?: string | null;
          id?: string;
          isRework?: boolean;
          repairId?: number;
          reworkCount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "warranties_repairId_fkey";
            columns: ["repairId"];
            isOneToOne: false;
            referencedRelation: "repairs";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      countComponentsTotalPrice: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      countStock: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      getAnnuallyRepairPrice: {
        Args: {
          year?: number;
        };
        Returns: number;
      };
      getAnnuallyRepairs: {
        Args: {
          year?: number;
        };
        Returns: number;
      };
      getMonthlyRepairPrice: {
        Args: {
          month?: string;
        };
        Returns: number;
      };
      getMonthlyRepairs: {
        Args: {
          month?: string;
        };
        Returns: {
          createdAt: string;
          customerId: number;
          deposit: number;
          id: number;
          isRework: boolean;
          phone: string;
          price: number;
          problem: string[] | null;
          status: string;
          updatedAt: string;
        }[];
      };
      getRepairsCountByMonth: {
        Args: {
          year?: number;
        };
        Returns: {
          month: string;
          repair_count: number;
        }[];
      };
      getRevenueByMonth: {
        Args: {
          year?: number;
        };
        Returns: {
          month: string;
          revenue: number;
        }[];
      };
      getTopList: {
        Args: Record<PropertyKey, never>;
        Returns: {
          name: string;
          count: number;
        }[];
      };
      search_components_name: {
        Args: {
          query: string;
        };
        Returns: {
          alias: string | null;
          brand: string;
          category: string;
          code: string | null;
          fts: unknown | null;
          id: number;
          model: string[] | null;
          name: string;
          public_price: number;
          purchase_price: number;
          quality: string;
          stock: number;
          supplier: string;
        }[];
      };
      update_component_stock: {
        Args: {
          components: Json;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
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
          owner_id: string | null;
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
          owner_id?: string | null;
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
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
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
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
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
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
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
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
