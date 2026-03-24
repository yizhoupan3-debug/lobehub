import { Icon } from '@lobehub/ui';
import { Progress, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { DatabaseIcon, MailIcon } from 'lucide-react';
import { memo } from 'react';
import useSWR from 'swr';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    margin-block: 12px;
    margin-inline: 8px;
    padding: 12px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 8px;

    background: ${token.colorFillQuaternary};
  `,
  mainApi: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-block-end: 8px;
    padding-block-end: 8px;
    border-block-end: 1px solid ${token.colorBorderSecondary};
  `,
  mainApiTitle: css`
    display: flex;
    gap: 6px;
    align-items: center;

    font-size: 13px;
    font-weight: 600;
    color: ${token.colorText};
  `,
  accountList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  accountCard: css`
    padding: 8px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 6px;
    background: ${token.colorFillTertiary};
  `,
  accountHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-block-end: 6px;

    font-size: 12px;
  `,
  email: css`
    overflow: hidden;
    display: flex;
    gap: 4px;
    align-items: center;

    max-width: 140px;

    font-weight: 500;
    color: ${token.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  plusTag: css`
    padding-block: 1px;
    padding-inline: 4px;
    border: 1px solid rgb(186 143 255 / 30%);
    border-radius: 4px;

    font-size: 10px;
    color: #ba8fff;

    background: rgb(186 143 255 / 15%);
  `,
  statsRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 11px;
    color: ${token.colorTextSecondary};
  `,
  progressWrapper: css`
    display: flex;
    flex-direction: column;
    width: 45%;
  `,
  processDot: css`
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
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
            <div className={styles.accountCard} key={acc.id}>
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
                  <Progress percent={percent5h} showInfo={false} size="small" strokeColor={percent5h > 80 ? theme.colorError : theme.colorPrimary} />
                </div>
                <div className={styles.progressWrapper}>
                  <span>7d 占额 {percent7d}%</span>
                  <Progress percent={percent7d} showInfo={false} size="small" strokeColor={percent7d > 80 ? theme.colorWarning : theme.colorSuccess} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
