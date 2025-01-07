import icon1 from '../../assets/Images/home-loan-page/humidity-percentage.svg'
import icon2 from '../../assets/Images/home-loan-page/payment-clock.svg'
import icon3 from '../../assets/Images/home-loan-page/dotted-border-tag.svg'
import icon4 from '../../assets/Images/home-loan-page/approval-delegation.svg'
import icon5 from '../../assets/Images/home-loan-page/support.svg'
import icon6 from '../../assets/Images/home-loan-page/happy-face.svg'
import backImage from '../../assets/Images/home-loan-page/bg-image.svg'
import avatar from '../../assets/Images/avatar.svg'
import './HomeLoanPage.scss'

const BenefitCard = ({ title, description, style, icon }: { title: string, description: string, style?: string, icon?: string }) => {
    return (
        <div className={`tw-flex section-container tw-flex-col tw-gap-2 tw-p-6 ${style}`}>
            <img src={icon} alt="" className="tw-size-8" />
            <h2 className='tw-text-sm tw-font-bold tw-text-[#25272D]'>{title}</h2>
            <p className='tw-text-sm tw-font-normal tw-text-[#656C7B]'>{description}</p>
        </div>
    )
}

const HomeLoanPage = () => {
    const benefits = [
        {
            icon: icon1,
            title: "Competitive Interest Rates",
            description: "Enjoy low interest rates tailored to suit your financial needs.",
        },
        {
            icon: icon2,
            title: "Flexible Repayment Options",
            description: "Choose repayment plans that work best for you, with flexible tenures.",
        },
        {
            icon: icon3,
            title: "No Hidden Fees",
            description: "Enjoy transparent loan terms with no hidden charges, ensuring complete clarity on costs.",
        },
        {
            icon: icon4,
            title: "Quick Loan Approval",
            description: "Experience a fast and hassle-free loan approval process.",
            style: "tw-row-start-auto md:tw-row-start-2"
        },
        {
            icon: icon5,
            title: "Expert Guidance and Support",
            description: "Get advice from our experienced loan executives at every step.",
            style: "tw-row-start-auto md:tw-row-start-2"
        },
        {
            icon: icon6,
            title: "Exclusive Offers for Existing Customers",
            description: "Take advantage of exclusive loan offers available to MyHome customers.",
            style: "tw-row-start-auto md:tw-row-start-3"
        }
    ];

    return (
        <main className="tw-flex tw-flex-col tw-gap-4 xl:tw-flex-row">
            <section className="left-section section-container tw-p-6 tw-w-auto tw-h-fit tw-relative">
                <div className='tw-flex tw-flex-col tw-gap-2 tw-mb-36 tw-relative tw-z-[1]'>
                    <h1 className='tw-text-lg tw-font-bold tw-text-[#25272D]'>Benefits of availing a loan from my home loans department</h1>
                    <p className='tw-text-sm tw-font-normal tw-text-[#656C7B]'>
                        Discover why choosing a loan with My Home Loans Department is the right decision for your financial needs.
                        Our loan services are designed to provide flexibility, convenience, and expert support, ensuring a smooth
                        and hassle-free experience from application to approval.
                    </p>
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-w-full tw-mt-6">
                        {benefits.map((benefit, index) => (
                            <BenefitCard
                                key={index}
                                title={benefit.title}
                                description={benefit.description}
                                icon={benefit.icon}
                                style={`${benefit.style} tw-col-span-1`}
                            />
                        ))}
                    </div>
                </div>
                <div className='tw-absolute tw-bottom-0 tw-right-0 tw-w-3/4 tw-z-0'>
                    <img src={backImage} alt="" className="tw-w-full tw-h-full tw-object-contain"  />
                </div>
            </section>
            <section className="right-section section-container tw-p-6 tw-h-fit">
                <div className="tw-flex tw-flex-col tw-gap-4">
                    <h4 className='tw-text-lg tw-font-bold tw-text-[#25272D]'>Reach out to us</h4>
                    <p className='tw-text-sm tw-font-normal tw-text-[#656C7B]'>Get in touch with our dedicated loan expert to guide you through every step of the loan process.</p>
                    <div className="tw-flex tw-flex-col tw-p-4 section-container">
                        <div className="tw-flex tw-flex-row tw-gap-4">
                            <img src={avatar} alt="" />
                            <div>
                                <h2>Aarav Sharma</h2>
                                <p>Loan Executive</p>
                            </div>
                        </div>
                        <hr className='tw-my-2' />
                        <div className="tw-flex tw-flex-col tw-gap-2">
                            <div className="tw-flex tw-flex-row tw-gap-4">
                                <img src={'/images/phone.svg'} alt="phone" />
                                <p><a href="tel:+919876543210">+91 9876543210</a></p>
                            </div>
                            <div className="tw-flex tw-flex-row tw-gap-4">
                                <img src="/images/mail.svg" alt="mail" />
                                <p><a href="mailto:loanexpert@myhomes.com">loanexpert@myhomes.com</a></p>
                            </div>
                            <div className="tw-flex tw-flex-row tw-gap-4">
                                <img src="/images/clock.svg" alt="timings" />
                                <p>9 am - 6 pm</p>
                            </div>
                        </div>
                    </div>
                    <button className="tw-bg-[#241F20] tw-text-[#FFFFFF] tw-p-3 tw-rounded-lg tw-w-full">Request a call back</button>
                </div>
            </section>
        </main >
    )
}

export default HomeLoanPage;