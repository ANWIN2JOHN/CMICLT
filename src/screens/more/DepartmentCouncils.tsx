import { useNavigate } from 'react-router-dom';
import { BookOpen, HeartHandshake, Landmark, Megaphone, Sprout } from 'lucide-react';
import { AdministrationMenu, LeadershipScreen } from '../../components/patterns/AdministrationUI';

export function DepartmentCouncils() {
  const nav = useNavigate();

  const items = [
    { label: 'Religious Life, Formation and Administration', to: '/more/leadership/department-councils/religious-life-formation-administration', icon: Landmark },
    { label: 'Evangelization and Pastoral Ministry', to: '/more/leadership/department-councils/evangelization-pastoral-ministry', icon: Megaphone },
    { label: 'Education and Communication Media', to: '/more/leadership/department-councils/education-communication-media', icon: BookOpen },
    { label: 'Social Apostolate and Healthcare', to: '/more/leadership/department-councils/social-apostolate-healthcare', icon: HeartHandshake },
    { label: 'Finance and Agriculture', to: '/more/leadership/department-councils/finance-agriculture', icon: Sprout },
  ];

  return (
    <LeadershipScreen
      title="Department Councils"
      description="Councils guiding formation, ministry, education, social apostolate and stewardship."
    >
      <div className="pt-3">
        <AdministrationMenu items={items} onSelect={nav} />
      </div>
    </LeadershipScreen>
  );
}
