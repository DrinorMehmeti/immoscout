export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          price: number
          location: string
          type: string
          listing_type: string
          rooms: number | null
          bathrooms: number | null
          area: number | null
          features: string[] | null
          images: string[] | null
          created_at: string | null
          updated_at: string | null
          status: string
          featured: boolean | null
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description: string
          price: number
          location: string
          type: string
          listing_type: string
          rooms?: number | null
          bathrooms?: number | null
          area?: number | null
          features?: string[] | null
          images?: string[] | null
          created_at?: string | null
          updated_at?: string | null
          status?: string
          featured?: boolean | null
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          price?: number
          location?: string
          type?: string
          listing_type?: string
          rooms?: number | null
          bathrooms?: number | null
          area?: number | null
          features?: string[] | null
          images?: string[] | null
          created_at?: string | null
          updated_at?: string | null
          status?: string
          featured?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string
          user_type: string
          is_premium: boolean
          premium_until: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          user_type: string
          is_premium?: boolean
          premium_until?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_type?: string
          is_premium?: boolean
          premium_until?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}