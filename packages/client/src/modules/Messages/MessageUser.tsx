import type { MessageUserProps } from "../../common/types";
import { IconUser } from "../../components";

export const MessageUser = ({ children }: MessageUserProps) => {
	return (
		<div className="flex items-start flex-row-reverse">
			<div className="text-slate-300 hidden sm:block">
				<IconUser />
			</div>
			<div className="flex flex-col rounded-b-xl rounded-tl-xl p-4 sm:max-w-md md:max-w-2xl bg-[#0B93F6] text-white prose prose-p:my-1 prose-indigo">
				<div className="relative flex flex-col gap-1 md:gap-3 ">
					<div className="flex flex-grow flex-col gap-3">
						<div className="flex flex-col items-start gap-3 overflow-x-auto whitespace-pre-wrap break-words">
							<div className="empty:hidden">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};