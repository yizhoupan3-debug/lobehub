import { execFile } from 'child_process';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { isAbsolute, join } from 'path';
import { promisify } from 'util';

const execFileP = promisify(execFile);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, workspacePath } = body;

    if (!action || !workspacePath) {
      return new Response(JSON.stringify({ error: 'Missing action or workspacePath' }), {
        status: 400,
      });
    }

    // 智能推测真实路径
    let targetPath = workspacePath;

    if (!isAbsolute(workspacePath)) {
      const home = homedir();
      // 高频工作区候选名
      const candidates = [
        join(home, 'Documents', '指示词宝库', workspacePath),
        join(home, 'Documents', workspacePath),
        join(home, 'Desktop', workspacePath),
        join(home, 'Downloads', workspacePath),
        join(home, workspacePath),
      ];

      let found = false;
      for (const p of candidates) {
        if (existsSync(p)) {
          targetPath = p;
          found = true;
          break;
        }
      }

      // 深度回退寻找 (Find maxdepth 3)
      if (!found) {
        try {
          const { stdout } = await execFileP('find', [
            join(home, 'Documents'),
            join(home, 'Desktop'),
            '-maxdepth',
            '3',
            '-type',
            'd',
            '-name',
            workspacePath,
          ]);
          const lines = stdout.trim().split('\n');
          if (lines.length > 0 && lines[0]) {
            targetPath = lines[0];
          } else {
            targetPath = join(home, 'Documents', '指示词宝库', workspacePath); // 最后盲猜 fallback
          }
        } catch {
          targetPath = join(home, 'Documents', '指示词宝库', workspacePath);
        }
      }
    }

    switch (action) {
      case 'finder':
        await execFileP('open', ['-a', 'Finder', targetPath]);
        break;
      case 'ide':
        try {
          // Antigravity 为主
          await execFileP('open', ['-a', 'Antigravity', targetPath]);
        } catch (e) {
          throw new Error('未能在本地拉起 Antigravity，打开此目录失败');
        }
        break;
      case 'custom_app':
        const { customAppName } = body;
        if (!customAppName) {
          throw new Error('未提供应用名称');
        }
        await execFileP('open', ['-a', customAppName, targetPath]);
        break;
      case 'terminal':
        await execFileP('open', ['-a', 'Terminal', targetPath]);
        break;
      case 'git_status': {
        try {
          const { stdout } = await execFileP('git', ['-C', targetPath, 'status', '-s']);
          return new Response(JSON.stringify({ success: true, targetPath, stdout: stdout || '没有未提交的变更' }), { status: 200 });
        } catch (e) {
          throw new Error('执行 git status 失败 (可能不是 git 仓库)');
        }
      }
      case 'git_diff': {
        try {
          const { stdout } = await execFileP('git', ['-C', targetPath, 'diff']);
          return new Response(JSON.stringify({ success: true, targetPath, stdout: stdout || '没有未提交的 diff 变更' }), { status: 200 });
        } catch (e) {
          throw new Error('执行 git diff 失败');
        }
      }
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, targetPath }), { status: 200 });
  } catch (error: any) {
    console.error('IDE Action fallback trigger fail:', error);
    return new Response(JSON.stringify({ error: error?.message || '执行失败' }), { status: 500 });
  }
}
