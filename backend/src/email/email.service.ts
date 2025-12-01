import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  private getBaseHtml(title: string, content: string): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const logoUrl = `${frontendUrl}/assets/altaa_ai_logo.png`;
    const year = new Date().getFullYear();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #edf2f7; }
          .content { padding: 40px 30px; color: #4a5568; line-height: 1.6; }
          .button { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; }
          .link-text { color: #2563eb; word-break: break-all; font-size: 12px; }
          h2 { color: #1a202c; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Logo" height="40" style="height: 40px; width: auto;">
          </div>
          
          <div class="content">
            ${content}
          </div>

          <div class="footer">
            <p>Este é um e-mail automático do Desafio Técnico ALTAA.</p>
            <p>&copy; ${year} ALTAA Digital.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Método específico para envio de convite
  async sendInviteEmail(to: string, companyName: string, role: string, inviteLink: string) {
    const content = `
      <h2>Você foi convidado! 🚀</h2>
      <p>Olá,</p>
      <p>Você recebeu um convite para se juntar à equipe da empresa <strong>${companyName}</strong> na plataforma ALTAA.</p>
      <p>Seu nível de acesso será: <strong style="background-color: #edf2f7; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;">${role}</strong>.</p>
      
      <p>Clique no botão abaixo para criar sua conta e aceitar o convite:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" class="button">Aceitar Convite</a>
      </div>

      <p style="font-size: 14px; margin-top: 30px;">Ou copie este link:</p>
      <a href="${inviteLink}" class="link-text">${inviteLink}</a>
      <p style="margin-top: 30px;">O link expira em 7 dias.</p>
    `;

    const html = this.getBaseHtml(`Convite para ${companyName}`, content);

    await this.mailerService.sendMail({
      to,
      subject: `Convite para participar da ${companyName}`,
      html,
    });
  }
}