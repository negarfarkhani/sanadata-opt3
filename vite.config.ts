import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function apiPlugin(): Plugin {
  let aiClient: GoogleGenAI | null = null;

  function getGenAI(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is missing');
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
          return;
        }

        if (req.url === '/api/gemini/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer | string) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const { prompt, systemMetrics, language } = JSON.parse(body || '{}');
              const ai = getGenAI();

              const systemInstruction = language === 'en'
                ? 'You are the Chief AI Operations Officer & System Reliability Engineer for the Sana Data Operations Platform. Provide crisp, high-value, operational insights, bottleneck detections, risk alerts, and concrete actionable steps. Format your answer with clean markdown bullet points.'
                : 'شما مدیر ارشد هوش مصنوعی و مهندس ارشد پایداری سیستم (SRE) در سامانه مدیریت عملیات و داده‌کاوی سنا هستید. یک گزارش تحلیلی عمیق، شفاف، عملیاتی و دقیق شامل وضعیت سلامت سیستم، گلوگاه‌های احتمالی، ارزیابی شاخص‌های SLA و پیشنهادات کاربردی جهت ارتقای بهره‌وری به زبان فارسی ارائه دهید. از قالب‌بندی خوانا و بالت پوینت استفاده کنید.';

              const contentPrompt = `
System Current Metrics:
${JSON.stringify(systemMetrics || {}, null, 2)}

User/Operator Request:
${prompt || (language === 'en' ? 'Provide a full operational diagnosis and recommendations for current workload.' : 'تحلیل جامع وضعیت عملیاتی سیستم و راهکارهای بهینه‌سازی بار پردازشی را ارائه دهید.')}
`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: contentPrompt,
                config: {
                  systemInstruction,
                  temperature: 0.7,
                },
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                analysis: response.text || '',
                timestamp: new Date().toISOString(),
              }));
            } catch (err: unknown) {
              const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: errorMessage,
              }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
