import { NodemailerEmailSender } from '@/infra/messaging/nodemailer-email-sender';

const mockSendMail = jest.fn().mockResolvedValue({});
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: (...args: any[]) => mockSendMail(...args) })),
}));

describe('NodemailerEmailSender', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should send email', async () => {
    const sut = new NodemailerEmailSender();
    await sut.send({
      to: 'test@test.com',
      subject: 'Test Subject',
      body: 'Test Body',
    });
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@test.com',
        subject: 'Test Subject',
        text: 'Test Body',
      }),
    );
  });
});
