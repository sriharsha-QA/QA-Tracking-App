import { Tooltip as ReactTooltip } from 'react-tooltip';

interface TooltipProps {
  id: string;
  content: string;
}

export const Tooltip = ({ id, content }: TooltipProps) => {
  return (
    <ReactTooltip
      id={id}
      place="top"
      content={content}
      className="z-50 max-w-xs bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
    />
  );
};