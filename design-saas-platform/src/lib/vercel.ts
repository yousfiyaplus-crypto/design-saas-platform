import { Vercel } from '@vercel/sdk';

export class VercelApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'VercelApiError';
  }
}

export function buildFileTree(files: { file: string; data: string }[]) {
  return files.map((f) => ({
    file: f.file,
    data: f.data,
  }));
}

export async function createVercelDeployment(
  token: string,
  projectName: string,
  files: { file: string; data: string }[],
  teamId?: string
) {
  const vercel = new Vercel({ bearerToken: token });
  try {
    const deployment = await vercel.deployments.createDeployment({
      requestBody: {
        name: projectName,
        files: buildFileTree(files),
        target: 'production',
        projectSettings: {
          framework: 'nextjs',
        },
        ...(teamId && { teamId }),
      },
    });
    return deployment;
  } catch (error: any) {
    throw new VercelApiError(error.message, error.status);
  }
}
