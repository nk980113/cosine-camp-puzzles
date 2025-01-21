import Image from "next/image";
import SingleInputBox from "./SingleInputBox";
import CoordInputWrapper from "./CoordInputWrapper";

export default function EventLevels({ level }: { level: 0 | 1 | 2 | 3 | 4 | 5 }) {
    const components = [
        <>
            <Image src='/i1.png' unoptimized width={100} height={100} alt='資訊' />
            <p>資訊</p>
        </>,
        <>
            <Image src='/i2.png' unoptimized width={100} height={100} alt='通訊' />
            <p>通訊</p>
        </>,
        <>
            <Image src='/i3.png' unoptimized width={100} height={100} alt='路線圖' />
            <p>路線圖</p>
        </>,
        <>
            <Image src='/i4.png' unoptimized width={100} height={100} alt='新位置' />
            <p>新位置</p>
        </>,
        <>
            <Image src='/i5.jpg' unoptimized width={100} height={100} alt='' />
            <p>"Who are you?"</p>
            <p>"I'm Ms. ____, also known as Agent Z."</p>
        </>,
        <h1 className='text-5xl font-semibold'>你們已經解開了所有謎題。</h1>
    ];

    return <>
        {...components.slice(0, level + 1)}
        {level < 5 && (level !== 2 && level !== 3 ? <SingleInputBox lv={level + 1 as any} /> : <CoordInputWrapper key='wrapper' lv={level + 1 as any} />)}
    </>
}