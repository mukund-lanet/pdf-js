import React from 'react';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import Stepper from "@trenchaant/pkg-ui-component-library/build/Components/Stepper";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
// import { setCreateContractDrawerOpen } from "../../store/action/contractManagement.actions";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";
import { contractTypeOptions, contractValueOptions } from '../../types';

const steps = [
  {
    label: "Upload Files",
    description: "Add contract documents"
  },
  {
    label: "Add Signers",
    description: "Assign recipients"
  },
];

const CreateContractDrawer = () => {
  const dispatch = useDispatch();
  const {
    createContractDrawerOpen,
    contractDrawerProgress,
    contractName,
    startDate,
    endDate,
    contractType,
    contractValue,
    contractValueCurrency,
    renewalPeriod,
    noticePeriod,
    autoRenewal,
    termsAndConditions,
    paymentTerms
  } = useSelector((state: RootState) => state?.contractManagement?.contractDrawer) || {
    createContractDrawerOpen: false,
    contractDrawerProgress: 0,
    contractName: "",
    contractType: "",
    contractValue: 0,
    contractValueCurrency: "",
    startDate: "",
    endDate: "",
    renewalPeriod: 0,
    noticePeriod: 0,
    autoRenewal: false,
    termsAndConditions: "",
    paymentTerms: ""
  };

  const handleDrawerClose = () => {
    // dispatch(setCreateContractDrawerOpen(false));
  }
  
  return (
    <Drawer
      anchor={"right"}
      open={createContractDrawerOpen}
      label={"Create New Contract"}
      description={"Upload contract documents and files"}
      closeIcon={true}
      size="medium"
      cancelBtn={{ onClick: () => { handleDrawerClose() }, label: "Cancel" }}
      onClose={() => { handleDrawerClose() }}
      className={styles.createNewContractDrawer}
    >
      <Stepper
        activeStep={contractDrawerProgress}
        steps={steps}
        labelPlacement="start"
        hidefooter
      >
        <div className={styles.stepperWrapper} >
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"e.g., Annual Software License Agreement"}
            label="Contract Name"
            hideBorder={true}
            value={contractName}
            // onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(setContractName(event.target?.value))}
            inputProps={{ className: 'py-10 text-13' }}
          />
          <div className={styles.contractTypeValueWrapper} >
            <Select 
              className={` ${styles.simpleSelectContractType} mr-10`}
              label={"Contract Type"}
              // onChange={(event) => handleTypeChange(event, "type")}
              value={contractType}
            >
              {contractTypeOptions.map((item, index) =>
                <MenuItem className='capitalize' key={index} value={item.key} >{item.value}</MenuItem>
              )}
            </Select>
            <div className={styles.contractValueWrapper} >
              <Typography className={styles.contractValueLabel} >Contract Value</Typography>
              <div className={styles.contractValueInputWrapper} >
                <Select 
                  className={` ${styles.simpleSelectContractCurrency} mr-10`}
                  // onChange={(event) => handleTypeChange(event, "type")}
                  value={contractValue}
                >
                  {contractValueOptions.map((item, index) =>
                    <MenuItem className='capitalize' key={index} value={item.key} >{item.value}</MenuItem>
                  )}
                </Select>
                <TextField
                  className={styles.contractCurrencyTextField}
                  fullWidth
                  variant="outlined"
                  placeholder={0.00}
                  hideBorder={true}
                  value={contractValueCurrency}
                  // onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(setStartDate(event.target?.value))}
                  inputProps={{ className: 'py-10 text-13' }}
                />
              </div>
            </div>
          </div>
          <div className={styles.startEndDateWrapper} >
            <TextField
              className={styles.starEndDate}
              fullWidth
              variant="outlined"
              placeholder={"dd/mm/yyyy"}
              label="Start Date"
              hideBorder={true}
              value={startDate}
              // onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(setStartDate(event.target?.value))}
              inputProps={{ className: 'py-10 text-13' }}
              />
            <TextField
              className={styles.starEndDate}
              fullWidth
              variant="outlined"
              placeholder={"dd/mm/yyyy"}
              label="End Date"
              hideBorder={true}
              value={endDate}
              // onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(setEndDate(event.target?.value))}
              inputProps={{ className: 'py-10 text-13' }}
            />
          </div>
        </div>
      </Stepper>
    </Drawer>
  )
}

export default CreateContractDrawer;