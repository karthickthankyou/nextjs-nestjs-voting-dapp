import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: [
      'https://voting-dapp-nextjs-nestjs-web.vercel.app',
      'https://personalities.iamkarthick.com',
      'https://studio.apollographql.com',
      'http://localhost:3001',
    ],
  })
  await app.listen(3000)
}
bootstrap()
