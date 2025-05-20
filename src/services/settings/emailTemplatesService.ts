
import { supabase } from "@/integrations/supabase/client";
import { EmailTemplate } from "@/types/settings";

/**
 * Service for managing email templates
 */
class EmailTemplatesService {
  /**
   * Get all email templates
   */
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }

    return data.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      variables: Array.isArray(template.variables) ? template.variables : [],
      isActive: template.is_active,
      createdAt: template.created_at,
      updatedAt: template.updated_at
    }));
  }

  /**
   * Get a single email template by ID
   */
  async getEmailTemplate(id: string): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching email template with ID ${id}:`, error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      content: data.content,
      variables: Array.isArray(data.variables) ? data.variables : [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Create a new email template
   */
  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        name: template.name,
        subject: template.subject,
        content: template.content,
        variables: template.variables,
        is_active: template.isActive,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating email template:', error);
      throw error;
    }

    // Log to audit
    await this.logTemplateAction('CREATE', 'Created email template: ' + template.name);

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      content: data.content,
      variables: Array.isArray(data.variables) ? data.variables : [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Update an existing email template
   */
  async updateEmailTemplate(id: string, template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .update({
        name: template.name,
        subject: template.subject,
        content: template.content,
        variables: template.variables,
        is_active: template.isActive,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(`Error updating email template with ID ${id}:`, error);
      throw error;
    }

    // Log to audit
    await this.logTemplateAction('UPDATE', 'Updated email template: ' + template.name);
  }

  /**
   * Delete an email template
   */
  async deleteEmailTemplate(id: string, name: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting email template with ID ${id}:`, error);
      throw error;
    }

    // Log to audit
    await this.logTemplateAction('DELETE', 'Deleted email template: ' + name);
  }

  /**
   * Log template action to audit log
   */
  private async logTemplateAction(action: string, description: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action,
          resource: 'EMAIL_TEMPLATES',
          description,
          ip_address: null, // This would typically come from the server
          user_agent: navigator.userAgent
        });
        
      if (error) {
        console.error('Error logging to audit:', error);
      }
    } catch (err) {
      console.error('Error logging to audit:', err);
    }
  }
}

export const emailTemplatesService = new EmailTemplatesService();
