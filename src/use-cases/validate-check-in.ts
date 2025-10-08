import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-in-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidateError } from './errors/late-check-in-validate-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCreation = dayjs(new Date()).diff(
      dayjs(checkIn.created_at),
      'minute',
    )

    if (distanceInMinutesFromCreation > 20) {
      throw new LateCheckInValidateError()
    }

    checkIn.validated_at = new Date()
    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
