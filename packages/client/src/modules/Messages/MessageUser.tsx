import type { MessageUserProps } from "../../common/types";

export const MessageUser = ({ children }: MessageUserProps) => {
	return (
		<div className="flex flex-row-reverse items-start">
			<div className="prose prose-indigo flex flex-col rounded-b-xl rounded-tl-xl bg-[#0B93F6] p-4 text-white prose-p:my-1 sm:max-w-md md:max-w-2xl">
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
