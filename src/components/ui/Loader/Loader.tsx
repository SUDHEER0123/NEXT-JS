import { LoaderProps, Loader as MantineLoader } from "@mantine/core";

interface ILoader extends LoaderProps {

}

export const Loader: React.FC<ILoader> = () => {
  return (
    <div className='flex w-full h-full'>
      <MantineLoader className='m-auto' type="dots" color="#06655E" />
    </div>
  )
}