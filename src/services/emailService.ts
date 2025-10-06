import nodemailer from 'nodemailer';

export interface WelcomeEmailData {
  userEmail: string;
  userName: string;
  planName: string;
  loginUrl: string;
  temporaryPassword?: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'noreply@updatererp.cloud',
      pass: process.env.SMTP_PASS || 'Flk@230509',
    },
  });

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    try {
      const htmlContent = this.generateWelcomeEmailHTML(data);

      const mailOptions = {
        from: `"Domius - Suporte" <${process.env.SMTP_USER || 'noreply@updatererp.cloud'}>`,
        to: data.userEmail,
        subject: '🚀 Bem-vindo ao Domius! Seus dados de acesso',
        html: htmlContent,
      };

      console.log('📧 Enviando email de boas-vindas para:', data.userEmail);
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado com sucesso:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Domius</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                background: linear-gradient(135deg, #f97316, #ea580c);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .title {
                color: #f97316;
                font-size: 28px;
                font-weight: bold;
                margin: 0;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
                margin: 10px 0 0 0;
            }
            .plan-badge {
                background: linear-gradient(135deg, #f97316, #ea580c);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                display: inline-block;
                margin: 20px 0;
            }
            .credentials-box {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
            }
            .credential-item {
                margin: 10px 0;
                padding: 10px;
                background: white;
                border-radius: 6px;
                border-left: 4px solid #f97316;
            }
            .credential-label {
                font-weight: bold;
                color: #333;
                display: block;
            }
            .credential-value {
                color: #666;
                font-family: 'Courier New', monospace;
                background: #f1f3f4;
                padding: 5px 8px;
                border-radius: 4px;
                margin-top: 5px;
                display: inline-block;
            }
            .cta-button {
                background: linear-gradient(135deg, #f97316, #ea580c);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                display: inline-block;
                margin: 20px 0;
                transition: all 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            }
            .features-list {
                background: #fff7ed;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .features-list h3 {
                color: #f97316;
                margin-top: 0;
            }
            .features-list ul {
                margin: 0;
                padding-left: 20px;
            }
            .features-list li {
                margin: 8px 0;
                color: #555;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #999;
                font-size: 14px;
            }
            .support-info {
                background: #e3f2fd;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚡</div>
                <h1 class="title">Bem-vindo ao Domius!</h1>
                <p class="subtitle">Sua jornada para dominar o marketing digital começa agora</p>
                <div class="plan-badge">🎉 ${data.planName}</div>
            </div>

            <p>Olá <strong>${data.userName}</strong>,</p>
            
            <p>Parabéns! Seu pagamento foi processado com sucesso e sua conta no Domius está ativa. Agora você tem acesso à plataforma mais completa de automação e marketing digital com IA.</p>

            <div class="credentials-box">
                <h3 style="margin-top: 0; color: #f97316;">🔐 Seus Dados de Acesso</h3>
                
                <div class="credential-item">
                    <span class="credential-label">📧 Email de Login:</span>
                    <div class="credential-value">${data.userEmail}</div>
                </div>
                
                ${data.temporaryPassword ? `
                <div class="credential-item">
                    <span class="credential-label">🔑 Senha Temporária:</span>
                    <div class="credential-value">${data.temporaryPassword}</div>
                    <small style="color: #666; display: block; margin-top: 5px;">
                        ⚠️ Altere sua senha no primeiro acesso
                    </small>
                </div>
                ` : ''}
                
                <div class="credential-item">
                    <span class="credential-label">🌐 Link de Acesso:</span>
                    <div class="credential-value">${data.loginUrl}</div>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="${data.loginUrl}" class="cta-button">
                    🚀 Acessar Minha Conta Agora
                </a>
            </div>

            <div class="features-list">
                <h3>🎯 O que você pode fazer agora:</h3>
                <ul>
                    <li>✨ Criar workflows de IA ilimitados</li>
                    <li>🤖 Gerar conteúdo automático com inteligência artificial</li>
                    <li>📄 Construir landing pages de alta conversão</li>
                    <li>📧 Automatizar campanhas de email marketing</li>
                    <li>📊 Acompanhar resultados em tempo real</li>
                    <li>💬 Suporte especializado quando precisar</li>
                </ul>
            </div>

            <div class="support-info">
                <strong>💬 Precisa de Ajuda?</strong><br>
                Nossa equipe está pronta para te ajudar!<br>
                📧 <a href="mailto:suporte@domius.com">suporte@domius.com</a>
            </div>

            <p>Estamos muito animados para ver o que você vai criar com o Domius. Sua jornada para dominar o marketing digital começa agora!</p>

            <p>Bem-vindo à família Domius! 🎉</p>

            <div class="footer">
                <p><strong>Domius - Transforme suas ideias em máquinas de vendas</strong></p>
                <p>© ${new Date().getFullYear()} Domius. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export const emailService = new EmailService();