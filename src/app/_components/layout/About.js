import SectionHeader from "./SectionHeader";



export default function About() {
  return (
    <section className="text-center mt-24">
      <SectionHeader title={"Unsere Geschichte"} subtitle={"Über uns"} />
      <p className="max-w-2xl mx-auto mt-4 text-gray-500 ">
        lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
        voluptatibus quas, expedita natus, aperiam quidem, doloremque
        consequuntur quod voluptate voluptates rerum similique.
      </p>
    </section>
  )
}
