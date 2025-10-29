import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) // Verifica apenas o cookie

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // Define que o cookie só pode ser enviado em conexões HTTPS
      sameSite: true, // Define que o cookie só pode ser enviado para o mesmo site (proteção contra CSRF)
      httpOnly: true, // Define que o cookie não pode ser acessado via JavaScript (proteção contra XSS)
    })
    .status(200)
    .send({ token })
}
