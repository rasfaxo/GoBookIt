import { memo } from 'react';
import { STRINGS } from '@/constants/strings';
import { Card, Button } from '@/components';

interface AuthNoticeProps {
  onLogin: () => void;
}

const AuthNotice = ({ onLogin }: AuthNoticeProps) => (
  <Card className="p-4 mb-4 border-amber-300 bg-amber-50/80 dark:bg-amber-900/30 dark:border-amber-600">
    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
      {STRINGS.auth.loginToBook}
      <Button size="sm" variant="primary" className="ml-3" onClick={onLogin}>
        {STRINGS.auth.loginTitle}
      </Button>
    </p>
  </Card>
);

export default memo(AuthNotice);
