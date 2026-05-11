'use client';

import { useState } from 'react';
import { btsMembers } from '@/lib/mock-data';
import styles from './bts.module.css';

export default function MemberSelector() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const activeMember = btsMembers.find(m => m.name === selectedMember);

  return (
    <>
      <div className={styles.memberGrid}>
        {btsMembers.map(member => (
          <button
            key={member.name}
            className={`${styles.memberCard} ${selectedMember === member.name ? styles.memberActive : ''}`}
            onClick={() => setSelectedMember(selectedMember === member.name ? null : member.name)}
            style={{ '--member-accent': member.color } as React.CSSProperties}
          >
            <div className={styles.memberColorStrip} />
            <div className={styles.memberAvatar}>{member.name.charAt(0)}</div>
            <div className={styles.memberInfo}>
              <span className={styles.memberName}>{member.name}</span>
              <span className={styles.memberKorean}>{member.koreanName}</span>
              <span className={styles.memberRole}>{member.role}</span>
            </div>
            {member.militaryStatus && (
              <span className={`${styles.militaryBadge} ${styles[`mil_${member.militaryStatus.status}`]}`}>
                {member.militaryStatus.status === 'completed' ? '✓ Returned' : member.militaryStatus.status === 'active_duty' ? '⟳ Serving' : '—'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected member detail */}
      {activeMember && (
        <div className={styles.memberDetail} style={{ borderColor: activeMember.color }}>
          <h3 className={styles.memberDetailName} style={{ color: activeMember.color }}>{activeMember.name} — {activeMember.koreanName}</h3>
          <p className={styles.memberDetailRole}>{activeMember.role}</p>
          {activeMember.militaryStatus?.status === 'completed' && (
            <p className={styles.memberDetailMilitary}>✓ Military service completed — {activeMember.militaryStatus.branch}</p>
          )}
        </div>
      )}
    </>
  );
}
