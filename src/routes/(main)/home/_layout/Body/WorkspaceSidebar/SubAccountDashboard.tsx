import { Icon } from '@lobehub/ui';
import { Skeleton, Progress, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { DatabaseIcon, MailIcon, ClockIcon, ActivityIcon, CheckCircle2Icon } from 'lucide-react';
import { memo } from 'react';
import useSWR from 'swr';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    margin: 12px 8px;
    padding: 12px;
    border-radius: 8px;
    background: ${token.colorFillQuaternary};
    border: 1px solid ${token.colorBorderSecondary};
  `,
  mainApi: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  mainApiTitle: css`
    font-size: 13px;
    font-weight: 600;
    color: ${token.colorText};
    display: flex;
    align-items: center;
    gap: 6px;
  `,
  accountList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  accountCard: css`
    padding: 8px;
    border-radius: 6px;
    background: ${token.colorFillTertiary};
    border: 1px solid ${token.colorBorderSecondary};
  `,
  accountHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 6px;
  `,
  email: css`
    color: ${token.colorText};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 140px;
  `,
  plusTag: css`
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 4px;
    background: rgba(186, 143, 255, 0.15);
    color: #ba8fff;
    border: 1px solid rgba(186, 143, 255, 0.3);
  `,
  statsRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: ${token.colorTextSecondary};
  `,
  progressWrapper: css`
    display: flex;
    flex-direction: column;
    width: 45%;
  `,
  processDot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  `,
}));

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SubAccountDashboard = memo(() => {
  const { styles, theme } = useStyles();
  
  // Aggregate Overview API
  const { data: overview, isLoading: overviewLoading } = useSWR('http://127.0.0.1:8001/api/overview', fetcher, {
    refreshInterval: 10000,
  });

  // Accounts List API
  const { data: accountsData, isLoading: accountsLoading } = useSWR('http://127.0.0.1:8001/api/accounts', fetcher, {
    refreshInterval: 10000,
  });

  if (overviewLoading || accountsLoading) {
    return (
      <div className={styles.container}>
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      </div>
    );
  }

  if (!overview || !accountsData) return null;

  const systemHealthy = overview.processes?.every((p: any) => p.status === 'running') ?? true;

  // Assuming max limit per account approx 500k for 5h, 3M for 7d (tune as needed)
  const MAX_5H_TOKENS = 500000;
  const MAX_7D_TOKENS = 3000000;

  return (
    <div className={styles.container}>
      {/* 聚合的主 API 板块 */}
      <div className={styles.mainApi}>
        <div className={styles.mainApiTitle}>
          <Icon icon={DatabaseIcon} size={{ fontSize: 14 }} />
          主 API 聚合节点
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ color: theme.colorTextSecondary }}>
            可用: {overview.activeAccounts}/{overview.accounts}
          </span>
          <span
            className={styles.processDot}
            style={{ background: systemHealthy ? theme.colorSuccess : theme.colorError }}
            title={systemHealthy ? '运行正常' : '异常'}
          />
        </div>
      </div>

      {/* 六个子账号列表 */}
      <div className={styles.accountList}>
        {accountsData.slice(0, 6).map((acc: any) => {
          // Calculate percentage quotas
          const percent5h = Math.min(100, Math.round(((acc.usage5hTokens || 0) / MAX_5H_TOKENS) * 100));
          const percent7d = Math.min(100, Math.round(((acc.usage7dTokens || 0) / MAX_7D_TOKENS) * 100));
          
          // Calculate Plus remaining time
          let plusRemaining = '普通账号';
          if (acc.subscriptionActiveUntil) {
            const daysLeft = Math.ceil((new Date(acc.subscriptionActiveUntil).getTime() - Date.now()) / 86400000);
            plusRemaining = daysLeft > 0 ? `剩 ${daysLeft} 天` : '已过期';
          } else if (acc.planType === 'plus') {
            plusRemaining = 'Plus活跃';
          }

          return (
            <div key={acc.id} className={styles.accountCard}>
              {/* Email & Auth Status */}
              <div className={styles.accountHeader}>
                <div className={styles.email} title={acc.email || '未绑定邮箱'}>
                  <Icon icon={MailIcon} size={{ fontSize: 12 }} />
                  {acc.email || `Agent ${acc.instanceNum}`}
                </div>
                {acc.planType === 'plus' ? (
                  <span className={styles.plusTag}>{plusRemaining}</span>
                ) : (
                  <span style={{ fontSize: 10, color: theme.colorTextTertiary }}>{plusRemaining}</span>
                )}
              </div>

              {/* Quotas */}
              <div className={styles.statsRow}>
                <div className={styles.progressWrapper}>
                  <span>5h 占额 {percent5h}%</span>
                  <Progress percent={percent5h} size="small" showInfo={false} strokeColor={percent5h > 80 ? theme.colorError : theme.colorPrimary} />
                </div>
                <div className={styles.progressWrapper}>
                  <span>7d 占额 {percent7d}%</span>
                  <Progress percent={percent7d} size="small" showInfo={false} strokeColor={percent7d > 80 ? theme.colorWarning : theme.colorSuccess} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
