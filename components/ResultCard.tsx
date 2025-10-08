
import React from 'react';
import { VKSND } from '../types';

interface ResultCardProps {
  procuracy: VKSND;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{value}</dd>
  </div>
);

const ResultCard: React.FC<ResultCardProps> = ({ procuracy }) => {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="bg-blue-800 p-4">
        <h3 className="text-lg font-bold leading-6 text-white">{procuracy.ten}</h3>
        <p className="mt-1 max-w-2xl text-sm text-blue-200">STT: {procuracy.stt}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
        <dl className="divide-y divide-gray-200">
          <InfoRow label="Phạm vi thẩm quyền" value={procuracy.phamViThamQuyen} />
          <InfoRow label="Địa điểm trụ sở" value={procuracy.diaDiem} />
          <InfoRow label="Đơn vị kế thừa" value={procuracy.donViKeThua} />
          <InfoRow label="Tỉnh/Thành phố" value={procuracy.tinh} />
        </dl>
      </div>
    </div>
  );
};

export default ResultCard;
