export interface ILoginRes {
    email: string,
    password: string,
    isCompleted: number,
    step: number,
    userData: [],
}

export interface IUser {
    main_user_id: number,
    student_id: number,
    session_id: string,
    session: string,
    sessionDetails: {
        token: string,
        session: string,
    },

    //for redirect login
    auth_id?: number,
    email?: string,
    name?: string
}

export interface Ipayment {


    milestone_sequence:number
    milestone_description:string
    total_milestone_amount:string
    payment_due_date:string
    milestone_status:any
    sgst_percentage:string
    cgst_percentage:string
    applied_milestone_percentage:string
    milestone_code_from_sap:string
    // name: string
    // description: string
    // payment_percentage: number
    // payment_due_date: string
    // status: string
    // basic_amount: number
    // gst: number
    // total_payable: number
}
export interface otherCharges {
    name: string
    total_legal_charges: string
    legal_charges_gst: number
    legal_charges_rate: string
    legal_charges: string
}

export interface IParking {
    unit_id: string
    total_parkings: number
    parking_slot_options: ParkingSlotOptions
}

export interface ParkingSlotOptions {
    "1": N1[]
    "2": N2[]
}

export interface N1 {
    basement: string
    basement_id: number
    count: any
}

export interface N2 {
    basement: string
    basement_id: number
    count: any
}

export interface IBookedParking {
    parking_no: number
    parking_id: number
    basement_level_id: number
    basement: string
    is_booked: number
    unit_no: number
    unit_description: any
    tower_no: number
    tower_name: string
    floor_no: number
    floor: any
  }