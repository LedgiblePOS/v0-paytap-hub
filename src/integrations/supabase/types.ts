export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_settings: {
        Row: {
          created_at: string | null
          currency_format: string | null
          date_format: string | null
          default_tax_rate: number | null
          fiscal_year_start: string
          id: string
          merchant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency_format?: string | null
          date_format?: string | null
          default_tax_rate?: number | null
          fiscal_year_start?: string
          id?: string
          merchant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency_format?: string | null
          date_format?: string | null
          default_tax_rate?: number | null
          fiscal_year_start?: string
          id?: string
          merchant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_settings_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          is_active: boolean
          merchant_id: string | null
          requests_count: number
          requests_limit: number
          reset_at: string
          time_window: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean
          merchant_id?: string | null
          requests_count?: number
          requests_limit: number
          reset_at?: string
          time_window: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean
          merchant_id?: string | null
          requests_count?: number
          requests_limit?: number
          reset_at?: string
          time_window?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limits_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_logs: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: string | null
          merchant_id: string | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status_code: number
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: string | null
          merchant_id?: string | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code: number
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string | null
          merchant_id?: string | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          ip_address: string | null
          resource: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          resource: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          resource?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          merchant_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          merchant_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          merchant_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_groups: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          merchant_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          merchant_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          merchant_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_groups_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          customer_group_id: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          last_purchase_date: string | null
          merchant_id: string
          phone: string | null
          postal_code: string | null
          state: string | null
          total_purchases: number | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_group_id?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          last_purchase_date?: string | null
          merchant_id: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          total_purchases?: number | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_group_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          last_purchase_date?: string | null
          merchant_id?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          total_purchases?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_customer_group_id_fkey"
            columns: ["customer_group_id"]
            isOneToOne: false
            referencedRelation: "customer_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          base_currency: string
          created_at: string
          id: string
          rates: Json
          updated_at: string
        }
        Insert: {
          base_currency: string
          created_at?: string
          id?: string
          rates: Json
          updated_at?: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          id?: string
          rates?: Json
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          merchant_id: string
          receipt_image_url: string | null
          tax_deductible: boolean | null
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          merchant_id: string
          receipt_image_url?: string | null
          tax_deductible?: boolean | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          merchant_id?: string
          receipt_image_url?: string | null
          tax_deductible?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      incomes: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          document_url: string | null
          id: string
          merchant_id: string
          source: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          document_url?: string | null
          id?: string
          merchant_id: string
          source: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          document_url?: string | null
          id?: string
          merchant_id?: string
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incomes_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          event_type: string
          external_reference: string | null
          id: string
          integration_type: string
          merchant_id: string | null
          request_data: Json | null
          response_data: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          event_type: string
          external_reference?: string | null
          id?: string
          integration_type: string
          merchant_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          event_type?: string
          external_reference?: string | null
          id?: string
          integration_type?: string
          merchant_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          merchant_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          merchant_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          merchant_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          cost: number | null
          created_at: string
          description: string | null
          id: string
          last_restock_date: string | null
          location: string | null
          merchant_id: string
          name: string
          product_id: string | null
          quantity: number
          reorder_point: number | null
          reorder_quantity: number | null
          selling_price: number
          sku: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_restock_date?: string | null
          location?: string | null
          merchant_id: string
          name?: string
          product_id?: string | null
          quantity?: number
          reorder_point?: number | null
          reorder_quantity?: number | null
          selling_price?: number
          sku: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_restock_date?: string | null
          location?: string | null
          merchant_id?: string
          name?: string
          product_id?: string | null
          quantity?: number
          reorder_point?: number | null
          reorder_quantity?: number | null
          selling_price?: number
          sku?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_locations: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          merchant_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          merchant_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          merchant_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_locations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          inventory_item_id: string
          merchant_id: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          quantity: number
          transaction_type: string
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id: string
          merchant_id: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          quantity: number
          transaction_type: string
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string
          merchant_id?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          quantity?: number
          transaction_type?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_analytics: {
        Row: {
          created_at: string | null
          id: string
          merchant_id: string | null
          metric_type: string
          metric_value: number
          period: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          metric_type: string
          metric_value: number
          period: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          metric_type?: string
          metric_value?: number
          period?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_analytics_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_api_credentials: {
        Row: {
          cbdc_api_url: string | null
          cbdc_password: string | null
          cbdc_username: string | null
          created_at: string | null
          fasstap_api_url: string | null
          fasstap_password: string | null
          fasstap_username: string | null
          id: string
          lynk_account_id: string | null
          lynk_api_url: string | null
          lynk_client_id: string | null
          lynk_client_secret: string | null
          lynk_enabled: boolean | null
          lynk_notification_url: string | null
          merchant_id: string
          updated_at: string | null
          use_cbdc: boolean | null
          use_fasstap_bridge: boolean | null
        }
        Insert: {
          cbdc_api_url?: string | null
          cbdc_password?: string | null
          cbdc_username?: string | null
          created_at?: string | null
          fasstap_api_url?: string | null
          fasstap_password?: string | null
          fasstap_username?: string | null
          id?: string
          lynk_account_id?: string | null
          lynk_api_url?: string | null
          lynk_client_id?: string | null
          lynk_client_secret?: string | null
          lynk_enabled?: boolean | null
          lynk_notification_url?: string | null
          merchant_id: string
          updated_at?: string | null
          use_cbdc?: boolean | null
          use_fasstap_bridge?: boolean | null
        }
        Update: {
          cbdc_api_url?: string | null
          cbdc_password?: string | null
          cbdc_username?: string | null
          created_at?: string | null
          fasstap_api_url?: string | null
          fasstap_password?: string | null
          fasstap_username?: string | null
          id?: string
          lynk_account_id?: string | null
          lynk_api_url?: string | null
          lynk_client_id?: string | null
          lynk_client_secret?: string | null
          lynk_enabled?: boolean | null
          lynk_notification_url?: string | null
          merchant_id?: string
          updated_at?: string | null
          use_cbdc?: boolean | null
          use_fasstap_bridge?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_api_credentials_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_customizations: {
        Row: {
          created_at: string
          custom_domain: string | null
          email_template: string | null
          id: string
          logo_url: string | null
          merchant_id: string
          theme_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          email_template?: string | null
          id?: string
          logo_url?: string | null
          merchant_id: string
          theme_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          email_template?: string | null
          id?: string
          logo_url?: string | null
          merchant_id?: string
          theme_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_customizations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_type: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          industry: string | null
          merchant_id: string
          postal_code: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          registration_number: string | null
          state: string | null
          tax_identifier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          merchant_id: string
          postal_code?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          registration_number?: string | null
          state?: string | null
          tax_identifier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          merchant_id?: string
          postal_code?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          registration_number?: string | null
          state?: string | null
          tax_identifier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_profiles_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_subscription_details: {
        Row: {
          billing_period_end: string | null
          billing_period_start: string | null
          card_last_four: string | null
          created_at: string | null
          id: string
          merchant_id: string
          next_billing_date: string | null
          payment_method: string | null
          payment_status: string | null
          status: string | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          merchant_id: string
          next_billing_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          merchant_id?: string
          next_billing_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_subscription_details_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_subscription_details_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_verifications: {
        Row: {
          created_at: string
          document_urls: string[] | null
          id: string
          is_verified: boolean | null
          merchant_id: string
          rejection_reason: string | null
          status: string | null
          updated_at: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          document_urls?: string[] | null
          id?: string
          is_verified?: boolean | null
          merchant_id: string
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          document_urls?: string[] | null
          id?: string
          is_verified?: boolean | null
          merchant_id?: string
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_verifications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          business_logo: string | null
          business_name: string | null
          country: string | null
          created_at: string | null
          default_currency: string | null
          id: string
          product_count: number | null
          product_limit: number | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_logo?: string | null
          business_name?: string | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          id?: string
          product_count?: number | null
          product_limit?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_logo?: string | null
          business_name?: string | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          id?: string
          product_count?: number | null
          product_limit?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_dismissed: boolean
          is_read: boolean
          merchant_id: string | null
          message: string
          notification_type: string
          priority: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          merchant_id?: string | null
          message: string
          notification_type: string
          priority: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          merchant_id?: string | null
          message?: string
          notification_type?: string
          priority?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_audit_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string | null
          id: string
          merchant_id: string | null
          payment_method: string | null
          raw_request: Json | null
          raw_response: Json | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string | null
          id?: string
          merchant_id?: string | null
          payment_method?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string | null
          id?: string
          merchant_id?: string | null
          payment_method?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_integration_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          integration_id: string | null
          merchant_id: string | null
          request_data: Json | null
          response_data: Json | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          integration_id?: string | null
          merchant_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          integration_id?: string | null
          merchant_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_integration_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "payment_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_integration_logs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_integrations: {
        Row: {
          created_at: string | null
          credentials: Json | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          merchant_id: string
          provider_name: string
          provider_type: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          merchant_id: string
          provider_name: string
          provider_type: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          merchant_id?: string
          provider_name?: string
          provider_type?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_integrations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_lynk_settings: {
        Row: {
          id: string
          lynk_account_id: string | null
          lynk_api_url: string | null
          lynk_client_id: string | null
          lynk_client_secret: string | null
          lynk_enabled: boolean | null
          lynk_notification_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          lynk_account_id?: string | null
          lynk_api_url?: string | null
          lynk_client_id?: string | null
          lynk_client_secret?: string | null
          lynk_enabled?: boolean | null
          lynk_notification_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          lynk_account_id?: string | null
          lynk_api_url?: string | null
          lynk_client_id?: string | null
          lynk_client_secret?: string | null
          lynk_enabled?: boolean | null
          lynk_notification_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pos_payment_methods: {
        Row: {
          created_at: string | null
          custom_fields: Json | null
          id: string
          is_active: boolean | null
          merchant_id: string
          name: string
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_fields?: Json | null
          id?: string
          is_active?: boolean | null
          merchant_id: string
          name: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_fields?: Json | null
          id?: string
          is_active?: boolean | null
          merchant_id?: string
          name?: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_payment_methods_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sessions: {
        Row: {
          card_sales: number | null
          cash_sales: number | null
          closed_at: string | null
          closed_by: string | null
          closing_amount: number | null
          id: string
          merchant_id: string
          notes: string | null
          opened_at: string | null
          opened_by: string | null
          opening_amount: number | null
          other_sales: number | null
          status: string
          total_discounts: number | null
        }
        Insert: {
          card_sales?: number | null
          cash_sales?: number | null
          closed_at?: string | null
          closed_by?: string | null
          closing_amount?: number | null
          id?: string
          merchant_id: string
          notes?: string | null
          opened_at?: string | null
          opened_by?: string | null
          opening_amount?: number | null
          other_sales?: number | null
          status?: string
          total_discounts?: number | null
        }
        Update: {
          card_sales?: number | null
          cash_sales?: number | null
          closed_at?: string | null
          closed_by?: string | null
          closing_amount?: number | null
          id?: string
          merchant_id?: string
          notes?: string | null
          opened_at?: string | null
          opened_by?: string | null
          opening_amount?: number | null
          other_sales?: number | null
          status?: string
          total_discounts?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_sessions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: number | null
          merchant_id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: number | null
          merchant_id: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: number | null
          merchant_id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      report_schedules: {
        Row: {
          created_at: string | null
          frequency: string
          id: string
          is_active: boolean | null
          last_run_at: string | null
          merchant_id: string
          next_run_at: string | null
          parameters: Json | null
          report_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          merchant_id: string
          next_run_at?: string | null
          parameters?: Json | null
          report_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          merchant_id?: string
          next_run_at?: string | null
          parameters?: Json | null
          report_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          merchant_id: string
          name: string
          report_type: string
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          merchant_id: string
          name: string
          report_type: string
          template_data?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          merchant_id?: string
          name?: string
          report_type?: string
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          generated_at: string | null
          id: string
          merchant_id: string
          parameters: Json | null
          report_type: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          generated_at?: string | null
          id?: string
          merchant_id: string
          parameters?: Json | null
          report_type: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          generated_at?: string | null
          id?: string
          merchant_id?: string
          parameters?: Json | null
          report_type?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      security_settings: {
        Row: {
          id: number
          max_login_attempts: number | null
          password_min_length: number | null
          password_require_numbers: boolean | null
          password_require_special_chars: boolean | null
          session_timeout: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: number
          max_login_attempts?: number | null
          password_min_length?: number | null
          password_require_numbers?: boolean | null
          password_require_special_chars?: boolean | null
          session_timeout?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: number
          max_login_attempts?: number | null
          password_min_length?: number | null
          password_require_numbers?: boolean | null
          password_require_special_chars?: boolean | null
          session_timeout?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          merchant_id: string
          new_tier: string
          previous_tier: string | null
          reason: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          merchant_id: string
          new_tier: string
          previous_tier?: string | null
          reason?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          merchant_id?: string
          new_tier?: string
          previous_tier?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          annual_price: number
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          monthly_price: number
          name: string
          product_limit: number
          transaction_fee_percentage: number | null
          updated_at: string
        }
        Insert: {
          annual_price: number
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          monthly_price: number
          name: string
          product_limit?: number
          transaction_fee_percentage?: number | null
          updated_at?: string
        }
        Update: {
          annual_price?: number
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          monthly_price?: number
          name?: string
          product_limit?: number
          transaction_fee_percentage?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          merchant_id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          merchant_id: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          merchant_id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          category: string | null
          created_at: string
          id: string
          metric_date: string
          metric_name: string
          metric_type: string
          metric_value: number
          notes: string | null
          percentage_change: number | null
          trend: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_name: string
          metric_type: string
          metric_value: number
          notes?: string | null
          percentage_change?: number | null
          trend?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          percentage_change?: number | null
          trend?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          allow_public_registration: boolean | null
          api_request_limit: number | null
          id: number
          maintenance_mode: boolean | null
          require_email_verification: boolean | null
          site_name: string
          support_email: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allow_public_registration?: boolean | null
          api_request_limit?: number | null
          id?: number
          maintenance_mode?: boolean | null
          require_email_verification?: boolean | null
          site_name?: string
          support_email?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allow_public_registration?: boolean | null
          api_request_limit?: number | null
          id?: number
          maintenance_mode?: boolean | null
          require_email_verification?: boolean | null
          site_name?: string
          support_email?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tax_categories: {
        Row: {
          created_at: string
          deduction_rate: number | null
          description: string | null
          id: string
          merchant_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deduction_rate?: number | null
          description?: string | null
          id?: string
          merchant_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deduction_rate?: number | null
          description?: string | null
          id?: string
          merchant_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_categories_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          merchant_id: string
          name: string
          rate: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          merchant_id: string
          name: string
          rate: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          merchant_id?: string
          name?: string
          rate?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_rates_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_reports: {
        Row: {
          generated_at: string
          id: string
          merchant_id: string
          quarter: number | null
          taxable_income: number
          total_deductible: number
          total_expenses: number
          total_income: number
          year: number
        }
        Insert: {
          generated_at?: string
          id?: string
          merchant_id: string
          quarter?: number | null
          taxable_income: number
          total_deductible: number
          total_expenses: number
          total_income: number
          year: number
        }
        Update: {
          generated_at?: string
          id?: string
          merchant_id?: string
          quarter?: number | null
          taxable_income?: number
          total_deductible?: number
          total_expenses?: number
          total_income?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_reports_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_settings: {
        Row: {
          apply_tax_to_all_products: boolean
          created_at: string
          id: string
          local_tax_rate: number
          merchant_id: string
          sales_tax_rate: number
          state_tax_rate: number
          updated_at: string
        }
        Insert: {
          apply_tax_to_all_products?: boolean
          created_at?: string
          id?: string
          local_tax_rate?: number
          merchant_id: string
          sales_tax_rate?: number
          state_tax_rate?: number
          updated_at?: string
        }
        Update: {
          apply_tax_to_all_products?: boolean
          created_at?: string
          id?: string
          local_tax_rate?: number
          merchant_id?: string
          sales_tax_rate?: number
          state_tax_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          subtotal: number
          transaction_id: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          subtotal: number
          transaction_id: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          subtotal?: number
          transaction_id?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string | null
          fee_percentage: number | null
          id: string
          merchant_id: string
          payment_method: string
          reference: string | null
          status: string
          transaction_fee: number | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id?: string | null
          fee_percentage?: number | null
          id?: string
          merchant_id: string
          payment_method: string
          reference?: string | null
          status: string
          transaction_fee?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          fee_percentage?: number | null
          id?: string
          merchant_id?: string
          payment_method?: string
          reference?: string | null
          status?: string
          transaction_fee?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requirements: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_mandatory: boolean | null
          requirement_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          requirement_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          requirement_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          merchant_id: string
          new_status: boolean
          notes: string | null
          previous_status: boolean | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          merchant_id: string
          new_status: boolean
          notes?: string | null
          previous_status?: boolean | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          merchant_id?: string
          new_status?: boolean
          notes?: string | null
          previous_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_status_history_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      wipay_api_credentials: {
        Row: {
          apple_pay_enabled: boolean | null
          created_at: string | null
          google_pay_enabled: boolean | null
          id: string
          merchant_id: string
          updated_at: string | null
          wipay_api_url: string | null
          wipay_password: string | null
          wipay_username: string | null
        }
        Insert: {
          apple_pay_enabled?: boolean | null
          created_at?: string | null
          google_pay_enabled?: boolean | null
          id?: string
          merchant_id: string
          updated_at?: string | null
          wipay_api_url?: string | null
          wipay_password?: string | null
          wipay_username?: string | null
        }
        Update: {
          apple_pay_enabled?: boolean | null
          created_at?: string | null
          google_pay_enabled?: boolean | null
          id?: string
          merchant_id?: string
          updated_at?: string | null
          wipay_api_url?: string | null
          wipay_password?: string | null
          wipay_username?: string | null
        }
        Relationships: []
      }
      wipay_payment_logs: {
        Row: {
          amount: number | null
          created_at: string | null
          details: Json | null
          error_message: string | null
          id: string
          merchant_id: string | null
          payment_method: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          merchant_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          merchant_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_merchant_ownership: {
        Args: { merchant_id: string }
        Returns: boolean
      }
      get_verification_data: {
        Args: { verification_id: string }
        Returns: Json
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      jsonb_set_key: {
        Args: { jsonb_data: Json; key_name: string; new_value: string }
        Returns: Json
      }
      verify_route_access: {
        Args: { route_path: string; user_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
