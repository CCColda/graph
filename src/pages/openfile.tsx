"use client"

import { StringifiedDOTToSearchParams, StringifyDOT } from "@/logic/dot/StringifyDOT";
import parse from "dotparser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function OpenDotFile() {
	const [blob, setBlob] = useState<Blob | null>(null);
	const router = useRouter();

	const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		if (ev.target.files?.length ?? 0 > 0) {
			setBlob(ev.target.files![0]);
		}
	}

	useEffect(() => {
		if (blob) {
			const reader = new FileReader()
			reader.onload = () => {
				const textData = typeof reader.result == "string"
					? reader.result
					: new TextDecoder().decode(reader.result ?? undefined);

				router.push(`/dot?` + StringifiedDOTToSearchParams(StringifyDOT(parse(textData))));
			}
			reader.readAsText(blob)
		}
	}, [blob]);

	return <main className="w-full h-full">
		<div className="w-full h-full flex flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center border-2 border-black rounded-md p-2">
				<span className="text-xl">Choose a <code>.dot</code> file to open</span>
				<input type="file" name="dotfile" accept="*.dot,*.txt" id="dotfile" onChange={onFileChange} />
			</div>
		</div>
	</main>
}