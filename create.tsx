import { useEffect, useState } from "react";
import { NextPage } from "next";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SideBar from "../../components/sidebar";
import TopBar from "../../components/topbar";
import { useAuth } from "../../hook/api/auth";
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  HomeIcon,
  MinusSmIcon,
  SelectorIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { Combobox } from "@headlessui/react";
import NumberFormat from "react-number-format";
import useUtilities from "../../hook/api/utilities";
import useEmployee from "../../hook/api/employee";

const pages = [
  { name: "Employee", href: "/employee", current: false },
  { name: "Create", href: null, current: true },
];

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
];

const schema = yup.object().shape({
  sub_departement : yup.number().positive().integer().required(),
  wage_system : yup.number().positive().integer().required(),
  position : yup.number().positive().integer().required(),
  type : yup.number().positive().integer().required(),
  grade : yup.number().positive().integer().nullable(),
  religion : yup.number().positive().integer().nullable(),
  education : yup.number().positive().integer().nullable(),
  major : yup.number().positive().integer().nullable(),
  image : yup.mixed()
          .nullable()
          .test(
            "fileFormat",
            "Unsupported Format",
            (value) => value === null || (value && SUPPORTED_FORMATS.includes(value.type))
          ),
  name : yup.string().required().max(50),
  sign_in : yup.string().required(),
  leave : yup.string().nullable(),
  wages : yup.number()
          .min(1)
          .positive()
          .required()
          .transform((_, value) => (value ? +value : undefined)),
  exit_statement : yup.string().nullable(),
  place_of_birth : yup.string().nullable(),
  date_of_birth : yup.string().nullable(),
  address : yup.string().nullable(),
  city : yup.string().nullable().max(50),
  postal_code : yup.string().nullable().max(15),
  phone : yup.string().nullable().max(15),
  gender : yup.mixed().oneOf(['male', 'female']).nullable(),
  blood_group :  yup.mixed().oneOf(['A', 'B', 'O', 'AB']).nullable(),
  weight : yup.number().positive().integer().nullable(),
  height : yup.number().positive().integer().nullable(),
  id_card_number : yup.string().nullable().max(50),
  family_status : yup.string().nullable().max(20),
  parent : yup.string().nullable().max(50),
  husband_and_wife : yup.string().nullable().max(50),
  insurances : yup.number().positive().integer().nullable(),
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Create: NextPage = () => {
  const bloodTypes = [
    { value: "A", name: "A" },
    { value: "B", name: "B" },
    { value: "AB", name: "AB" },
    { value: "O", name: "O" },
  ];
  const genders = [
    { value: "male", name: "Male" },
    { value: "female", name: "Female" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLgOpen, setSidebarLgOpen] = useState(true);
  const [openMessageModal, setOpenMessageModal] = useState(true);
  const [errors, setErrors] = useState([]);
  const [queryGenders, setQueryGenders] = useState("");
  const [selectedGenders, setSelectedGenders] = useState();
  const [queryBloodTypes, setQueryBloodTypes] = useState("");
  const [selectedBloodTypes, setSelectedBloodTypes] = useState();
  const [subDepartements, setSubDepartements] = useState([]);
  const [querySubDepartements, setQuerySubDepartements] = useState("");
  const [selectedSubDepartements, setSelectedSubDepartements] = useState();
  const [wageSystems, setWageSystems] = useState([]);
  const [queryWageSystems, setQueryWageSystems] = useState("");
  const [selectedWageSystems, setSelectedWageSystems] = useState();
  const [positions, setPositions] = useState([]);
  const [queryPositions, setQueryPositions] = useState("");
  const [selectedPositions, setSelectedPositions] = useState();
  const [types, setTypes] = useState([]);
  const [queryTypes, setQueryTypes] = useState("");
  const [selectedTypes, setSelectedTypes] = useState();
  const [grades, setGrades] = useState([]);
  const [queryGrades, setQueryGrades] = useState("");
  const [selectedGrades, setSelectedGrades] = useState();
  const [religions, setReligions] = useState([]);
  const [queryReligions, setQueryReligions] = useState("");
  const [selectedReligions, setSelectedReligions] = useState();
  const [educations, setEducations] = useState([]);
  const [queryEducations, setQueryEducations] = useState("");
  const [selectedEducations, setSelectedEducations] = useState();
  const [majors, setMajors] = useState([]);
  const [queryMajors, setQueryMajors] = useState("");
  const [selectedMajors, setSelectedMajors] = useState();
  const [insurances, setInsurances] = useState([]);
  const [queryInsurances, setQueryInsurances] = useState("");
  const [selectedInsurances, setSelectedInsurances] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: formState,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "insurance",
  });

  const { isLoading, user, logout } = useAuth({ middleware: "auth" });
  const { status, store } = useEmployee();
  const {
    getSubDepartements,
    getWageSystems,
    getPositions,
    getTypes,
    getGrades,
    getReligions,
    getEducations,
    getMajors,
    getInsurances,
  } = useUtilities();

  useEffect(() => {
    const fetch = async () => {
      await getSubDepartements({ setErrors, setSubDepartements });
      await getWageSystems({ setErrors, setWageSystems });
      await getPositions({ setErrors, setPositions });
      await getTypes({ setErrors, setTypes });
      await getGrades({ setErrors, setGrades });
      await getReligions({ setErrors, setReligions });
      await getEducations({ setErrors, setEducations });
      await getMajors({ setErrors, setMajors });
      await getInsurances({ setErrors, setInsurances });
    };

    fetch();
  }, []);

  const onSubmit = async (data) => {       
    await store({ setErrors, data });
    setValue("image", '');
    setOpenMessageModal(true);
  };

  const filteredSubDepartements =
    querySubDepartements === ""
      ? subDepartements
      : subDepartements.filter((subDepartement) => {
          return subDepartement.name
            .toLowerCase()
            .includes(querySubDepartements.toLowerCase());
        });

  const filteredWageSystems =
    queryWageSystems === ""
      ? wageSystems
      : wageSystems.filter((wageSystem) => {
          return wageSystem.name
            .toLowerCase()
            .includes(queryWageSystems.toLowerCase());
        });

  const filteredPositions =
    queryPositions === ""
      ? positions
      : positions.filter((position) => {
          return position.name
            .toLowerCase()
            .includes(queryPositions.toLowerCase());
        });

  const filteredTypes =
    queryTypes === ""
      ? types
      : types.filter((type) => {
          return type.name.toLowerCase().includes(queryTypes.toLowerCase());
        });

  const filteredGrades =
    queryGrades === ""
      ? grades
      : grades.filter((grade) => {
          return grade.name.toLowerCase().includes(queryGrades.toLowerCase());
        });

  const filteredReligions =
    queryReligions === ""
      ? religions
      : religions.filter((religion) => {
          return religion.name
            .toLowerCase()
            .includes(queryReligions.toLowerCase());
        });

  const filteredEducations =
    queryEducations === ""
      ? educations
      : educations.filter((education) => {
          return education.name
            .toLowerCase()
            .includes(queryEducations.toLowerCase());
        });

  const filteredMajors =
    queryMajors === ""
      ? majors
      : majors.filter((major) => {
          return major.name.toLowerCase().includes(queryMajors.toLowerCase());
        });

  const filteredGenders =
    queryGenders === ""
      ? genders
      : genders.filter((gender) => {
          return gender.name.toLowerCase().includes(queryGenders.toLowerCase());
        });

  const filteredBloodTypes =
    queryBloodTypes === ""
      ? bloodTypes
      : bloodTypes.filter((bloodType) => {
          return bloodType.name
            .toLowerCase()
            .includes(queryBloodTypes.toLowerCase());
        });

  const filteredInsurances =
    queryInsurances === ""
      ? insurances
      : insurances.filter((insurances) => {
          return insurances.name
            .toLowerCase()
            .includes(queryInsurances.toLowerCase());
        });

  if (isLoading || !user) return null;

  return (
    <>
      <div className="min-h-full">
        {/* Static sidebar for desktop */}
        <SideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarLgOpen={sidebarLgOpen}
        />

        <div
          className={classNames(
            sidebarLgOpen ? "lg:pl-64" : "",
            "flex flex-1 flex-col "
          )}
        >
          <TopBar
            setSidebarOpen={setSidebarOpen}
            sidebarLgOpen={sidebarLgOpen}
            setSidebarLgOpen={setSidebarLgOpen}
            user={user}
            logout={logout}
          />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <nav className="mb-8 flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div>
                    <Link href="/dashboard" passHref>
                      <a className="text-gray-400 hover:text-gray-500">
                        <HomeIcon
                          className="h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Home</span>
                      </a>
                    </Link>
                  </div>
                </li>
                {pages.map((page) => (
                  <li key={page.name}>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {page.href ? (
                        <Link href={page.href} passHref>
                          <a
                            className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                            aria-current={page.current ? "page" : undefined}
                          >
                            {page.name}
                          </a>
                        </Link>
                      ) : (
                        <span
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                          aria-current={page.current ? "page" : undefined}
                        >
                          {page.name}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>

            {errors.length > 0 && (
              <div className="mb-8 rounded-md border bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      There were {errors.length} errors
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul role="list" className="list-disc space-y-1 pl-5">
                        {errors.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status && openMessageModal && (
              <div className="mb-8 rounded-md border bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {status.message}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        onClick={() => setOpenMessageModal(false)}
                        type="button"
                        className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                      >
                        <span className="sr-only">Dismiss</span>
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                <div className="divide-y divide-gray-200">
                  <div className=" flex h-16 bg-white px-4 sm:px-6">
                    <div className="-ml-4 -mt-2 flex flex-1 flex-wrap items-center justify-between sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Create new employee
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y">
                    <div className="space-y-6 px-4 py-6 sm:space-y-5 sm:px-6">
                      <div className="flex flex-col items-center space-y-4">
                        <label
                          htmlFor="photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Photo
                        </label>

                        <div className="mt-1 flex flex-col items-center space-y-4">
                          <span className="h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image"
                              className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <span>Change</span>
                              <input
                                {...register("image")}
                                id="image"
                                name="image"
                                type="file"
                                className="sr-only"
                                onChange={(event) =>{
                                  console.log(event);
                                  
                                  setValue("image", event.target.files[0]);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <Controller
                            control={control}
                            name="sub_departement"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedSubDepartements}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedSubDepartements(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Sub departement
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.sub_departement
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQuerySubDepartements(
                                        event.target.value
                                      )
                                    }
                                    displayValue={(subDepartement) =>
                                      subDepartement.name
                                    }
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.sub_departement
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredSubDepartements.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredSubDepartements.map(
                                        (subDepartement) => (
                                          <Combobox.Option
                                            key={subDepartement.id}
                                            value={subDepartement}
                                            className={({ active }) =>
                                              classNames(
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                                active
                                                  ? "bg-indigo-600 text-white"
                                                  : "text-gray-900"
                                              )
                                            }
                                          >
                                            {({ active, selected }) => (
                                              <>
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {subDepartement.name}
                                                </span>

                                                {selected && (
                                                  <span
                                                    className={classNames(
                                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                                      active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                    )}
                                                  >
                                                    <CheckIcon
                                                      className="h-5 w-5"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </Combobox.Option>
                                        )
                                      )}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.sub_departement && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.sub_departement && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.sub_departement.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name="wage_system"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedWageSystems}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedWageSystems(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Wage System
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.wage_system
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryWageSystems(event.target.value)
                                    }
                                    displayValue={(wageSystem) =>
                                      wageSystem.name
                                    }
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.wage_system
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredWageSystems.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredWageSystems.map(
                                        (wageSystem) => {
                                          return (
                                            <Combobox.Option
                                              key={wageSystem.id}
                                              value={wageSystem}
                                              className={({ active }) =>
                                                classNames(
                                                  "relative cursor-default select-none py-2 pl-3 pr-9",
                                                  active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900"
                                                )
                                              }
                                            >
                                              {({ active, selected }) => (
                                                <>
                                                  <span
                                                    className={classNames(
                                                      "block truncate",
                                                      selected &&
                                                        "font-semibold"
                                                    )}
                                                  >
                                                    {wageSystem.name}
                                                  </span>

                                                  {selected && (
                                                    <span
                                                      className={classNames(
                                                        "absolute inset-y-0 right-0 flex items-center pr-4",
                                                        active
                                                          ? "text-white"
                                                          : "text-indigo-600"
                                                      )}
                                                    >
                                                      <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                            </Combobox.Option>
                                          );
                                        }
                                      )}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.wage_system && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.wage_system && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.wage_system.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <div>
                          <Controller
                            control={control}
                            name="position"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedPositions}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedPositions(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Position
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.position
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryPositions(event.target.value)
                                    }
                                    displayValue={(position) => position.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.position
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredPositions.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredPositions.map(
                                        (position) => (
                                          <Combobox.Option
                                            key={position.id}
                                            value={position}
                                            className={({ active }) =>
                                              classNames(
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                                active
                                                  ? "bg-indigo-600 text-white"
                                                  : "text-gray-900"
                                              )
                                            }
                                          >
                                            {({ active, selected }) => (
                                              <>
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {position.name}
                                                </span>

                                                {selected && (
                                                  <span
                                                    className={classNames(
                                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                                      active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                    )}
                                                  >
                                                    <CheckIcon
                                                      className="h-5 w-5"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </Combobox.Option>
                                        )
                                      )}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.position && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.position && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.position.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name="type"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedTypes}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedTypes(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Type
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.type
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryTypes(event.target.value)
                                    }
                                    displayValue={(type) => type.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.type
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredTypes.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredTypes.map((type) => (
                                        <Combobox.Option
                                          key={type.id}
                                          value={type}
                                          className={({ active }) =>
                                            classNames(
                                              "relative cursor-default select-none py-2 pl-3 pr-9",
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                            )
                                          }
                                        >
                                          {({ active, selected }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  "block truncate",
                                                  selected && "font-semibold"
                                                )}
                                              >
                                                {type.name}
                                              </span>

                                              {selected && (
                                                <span
                                                  className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      ))}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.type && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.type && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.type.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name="grade"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedGrades}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedGrades(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Grade
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.grade
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryGrades(event.target.value)
                                    }
                                    displayValue={(grade) => grade.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.grade
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredGrades.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredGrades.map((grade) => (
                                        <Combobox.Option
                                          key={grade.id}
                                          value={grade}
                                          className={({ active }) =>
                                            classNames(
                                              "relative cursor-default select-none py-2 pl-3 pr-9",
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                            )
                                          }
                                        >
                                          {({ active, selected }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  "block truncate",
                                                  selected && "font-semibold"
                                                )}
                                              >
                                                {grade.name}
                                              </span>

                                              {selected && (
                                                <span
                                                  className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      ))}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.grade && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.grade && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.grade.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <div className="relative mt-1">
                          <input
                            {...register("name")}
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className={classNames(
                              !formState.errors.name
                                ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                : "border-red-300 focus:border-red-500 focus:ring-red-500",
                              "block w-full rounded-md shadow-sm sm:text-sm"
                            )}
                          />

                          {formState.errors.name && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        {formState.errors.name && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            {formState.errors.name.message}.
                          </p>
                        )}
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <label
                            htmlFor="sign_in"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Sign In
                          </label>
                          <div className="relative mt-1">
                            <Controller
                              control={control}
                              name="sign_in"
                              render={({
                                field: { onChange, name, value },
                              }) => (
                                <NumberFormat
                                  format="##/##/####"
                                  name={name}
                                  value={value}
                                  onChange={onChange}
                                  placeholder="dd/mm/yyyy"
                                  className={classNames(
                                    !formState.errors.sign_in
                                      ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                      : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    "block w-full rounded-md shadow-sm sm:text-sm"
                                  )}
                                />
                              )}
                            />

                            {formState.errors.sign_in && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.sign_in && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.sign_in.message}.
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="leave"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Leave
                          </label>
                          <div className="relative mt-1">
                            <Controller
                              control={control}
                              name="leave"
                              render={({
                                field: { onChange, name, value },
                              }) => (
                                <NumberFormat
                                  format="##/##/####"
                                  name={name}
                                  value={value}
                                  onChange={onChange}
                                  placeholder="dd/mm/yyyy"
                                  className={classNames(
                                    !formState.errors.leave
                                      ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                      : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    "block w-full rounded-md shadow-sm sm:text-sm"
                                  )}
                                />
                              )}
                            />

                            {formState.errors.leave && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.leave && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.leave.message}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="wages"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Wages
                        </label>
                        <div className="relative mt-1">
                        <Controller
                            control={control}
                            name="wages"
                            render={({ field: { onChange, name, value } }) => (
                              <NumberFormat
                                thousandSeparator={true}
                                allowNegative={false}
                                prefix={'Rp.'}
                                name={name}
                                value={value}
                                onValueChange={({ value }) => {
                                  onChange({
                                    target: {
                                      value: value.replace(",", ""),
                                    },
                                  });
                                }}
                                className={classNames(
                                  !formState.errors.wages
                                    ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                  "block w-full rounded-md shadow-sm sm:text-sm"
                                )}
                              />
                            )}
                          />

                          {formState.errors.wages && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        {formState.errors.wages && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            {formState.errors.wages.message}.
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="exit_statement"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Exit statement
                        </label>
                        <div className="relative mt-1">
                          <textarea
                            {...register("exit_statement")}
                            id="exit_statement"
                            name="exit_statement"
                            rows={3}
                            className={classNames(
                              !formState.errors.exit_statement
                                ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                : "border-red-300 focus:border-red-500 focus:ring-red-500",
                              "block w-full rounded-md shadow-sm sm:text-sm"
                            )}
                            defaultValue={""}
                          />

                          {formState.errors.exit_statement && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        {formState.errors.exit_statement && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            {formState.errors.exit_statement.message}.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6 px-4 py-6 sm:space-y-5 sm:px-6">
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Personal Information
                        </h3>
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <label
                            htmlFor="place_of_birth"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Place of birth
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("place_of_birth")}
                              id="place_of_birth"
                              name="place_of_birth"
                              type="text"
                              autoComplete="place_of_birth"
                              className={classNames(
                                !formState.errors.place_of_birth
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.place_of_birth && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.place_of_birth && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.place_of_birth.message}.
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="date_of_birth"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date of birth
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("date_of_birth")}
                              id="date_of_birth"
                              name="date_of_birth"
                              type="text"
                              autoComplete="date_of_birth"
                              className={classNames(
                                !formState.errors.date_of_birth
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.date_of_birth && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.date_of_birth && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.date_of_birth.message}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <div className="relative mt-1">
                          <textarea
                            {...register("address")}
                            id="address"
                            name="address"
                            rows={3}
                            className={classNames(
                              !formState.errors.address
                                ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                : "border-red-300 focus:border-red-500 focus:ring-red-500",
                              "block w-full rounded-md shadow-sm sm:text-sm"
                            )}
                            defaultValue={""}
                          />

                          {formState.errors.address && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        {formState.errors.address && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            {formState.errors.address.message}.
                          </p>
                        )}
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("city")}
                              id="city"
                              name="city"
                              type="text"
                              autoComplete="city"
                              className={classNames(
                                !formState.errors.city
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.city && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.city && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.city.message}.
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="postal_code"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <div className="relative mt-1">
                            <Controller
                              control={control}
                              name="postal_code"
                              render={({
                                field: { onChange, name, value },
                              }) => (
                                <NumberFormat
                                  name={name}
                                  value={value}
                                  onChange={onChange}
                                  className={classNames(
                                    !formState.errors.postal_code
                                      ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                      : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    "block w-full rounded-md shadow-sm sm:text-sm"
                                  )}
                                />
                              )}
                            />

                            {formState.errors.postal_code && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.postal_code && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.postal_code.message}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <div className="relative mt-1">
                          <input
                            {...register("phone")}
                            id="phone"
                            name="phone"
                            type="text"
                            autoComplete="phone"
                            className={classNames(
                              !formState.errors.phone
                                ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                : "border-red-300 focus:border-red-500 focus:ring-red-500",
                              "block w-full rounded-md shadow-sm sm:text-sm"
                            )}
                          />

                          {formState.errors.phone && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>

                        {formState.errors.phone && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            {formState.errors.phone.message}.
                          </p>
                        )}
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedGenders}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.value,
                                    },
                                  });

                                  return setSelectedGenders(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Gender
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.gender
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryGenders(event.target.value)
                                    }
                                    displayValue={(gender) => gender.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.gender
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredGenders.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredGenders.map((gender) => (
                                        <Combobox.Option
                                          key={gender.value}
                                          value={gender}
                                          className={({ active }) =>
                                            classNames(
                                              "relative cursor-default select-none py-2 pl-3 pr-9",
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                            )
                                          }
                                        >
                                          {({ active, selected }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  "block truncate",
                                                  selected && "font-semibold"
                                                )}
                                              >
                                                {gender.name}
                                              </span>

                                              {selected && (
                                                <span
                                                  className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      ))}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.gender && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.gender && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.gender.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name="blood_group"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedBloodTypes}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.value,
                                    },
                                  });

                                  return setSelectedBloodTypes(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Blood Type
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.blood_group
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryBloodTypes(event.target.value)
                                    }
                                    displayValue={(bloodType) => bloodType.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.blood_group
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredBloodTypes.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredBloodTypes.map(
                                        (bloodType, index) => (
                                          <Combobox.Option
                                            key={index}
                                            value={bloodType}
                                            className={({ active }) =>
                                              classNames(
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                                active
                                                  ? "bg-indigo-600 text-white"
                                                  : "text-gray-900"
                                              )
                                            }
                                          >
                                            {({ active, selected }) => (
                                              <>
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {bloodType.name}
                                                </span>

                                                {selected && (
                                                  <span
                                                    className={classNames(
                                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                                      active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                    )}
                                                  >
                                                    <CheckIcon
                                                      className="h-5 w-5"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </Combobox.Option>
                                        )
                                      )}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.blood_group && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.blood_group && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.blood_group.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <label
                            htmlFor="weight"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Weight
                          </label>
                          <div className="relative mt-1 flex">
                            <Controller
                              control={control}
                              name="weight"
                              render={({
                                field: { onChange, name, value },
                              }) => (
                                <NumberFormat
                                  name={name}
                                  value={value}
                                  onChange={onChange}
                                  className={classNames(
                                    !formState.errors.weight
                                      ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                      : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    "block w-full rounded-none rounded-l-md shadow-sm sm:text-sm"
                                  )}
                                />
                              )}
                            />

                            {formState.errors.weight && (
                              <div className="pointer-events-none absolute inset-y-0 right-10 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}

                            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                              Kg
                            </span>
                          </div>

                          {formState.errors.weight && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.weight.message}.
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="height"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Height
                          </label>
                          <div className="relative mt-1 flex">
                            <Controller
                              control={control}
                              name="height"
                              render={({
                                field: { onChange, name, value },
                              }) => (
                                <NumberFormat
                                  name={name}
                                  value={value}
                                  onChange={onChange}
                                  className={classNames(
                                    !formState.errors.height
                                      ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                      : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    "block w-full rounded-none rounded-l-md shadow-sm sm:text-sm"
                                  )}
                                />
                              )}
                            />

                            {formState.errors.height && (
                              <div className="pointer-events-none absolute inset-y-0 right-10 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}

                            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                              Cm
                            </span>
                          </div>

                          {formState.errors.height && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.height.message}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <label
                            htmlFor="id_card_number"
                            className="block text-sm font-medium text-gray-700"
                          >
                            ID Card
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("id_card_number")}
                              id="id_card_number"
                              name="id_card_number"
                              type="text"
                              autoComplete="id_card_number"
                              className={classNames(
                                !formState.errors.id_card_number
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.id_card_number && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.id_card_number && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.id_card_number.message}.
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="family_status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Family Status
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("family_status")}
                              id="family_status"
                              name="family_status"
                              type="text"
                              autoComplete="family_status"
                              className={classNames(
                                !formState.errors.family_status
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.family_status && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.family_status && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.family_status.message}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                        <div>
                          <label
                            htmlFor="parent"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Parent
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("parent")}
                              id="parent"
                              name="parent"
                              type="text"
                              autoComplete="parent"
                              className={classNames(
                                !formState.errors.parent
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.parent && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.parent && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.parent.message}.
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="husband_and_wife"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Husband & Wife
                          </label>
                          <div className="relative mt-1">
                            <input
                              {...register("husband_and_wife")}
                              id="husband_and_wife"
                              name="husband_and_wife"
                              type="text"
                              autoComplete="husband_and_wife"
                              className={classNames(
                                !formState.errors.husband_and_wife
                                  ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                "block w-full rounded-md shadow-sm sm:text-sm"
                              )}
                            />

                            {formState.errors.husband_and_wife && (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          {formState.errors.husband_and_wife && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {formState.errors.husband_and_wife.message}.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <div>
                          <Controller
                            control={control}
                            name="religion"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedReligions}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedReligions(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Religion
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.religion
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryReligions(event.target.value)
                                    }
                                    displayValue={(religion) => religion.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.religion
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredReligions.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredReligions.map(
                                        (religion) => (
                                          <Combobox.Option
                                            key={religion.id}
                                            value={religion}
                                            className={({ active }) =>
                                              classNames(
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                                active
                                                  ? "bg-indigo-600 text-white"
                                                  : "text-gray-900"
                                              )
                                            }
                                          >
                                            {({ active, selected }) => (
                                              <>
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {religion.name}
                                                </span>

                                                {selected && (
                                                  <span
                                                    className={classNames(
                                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                                      active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                    )}
                                                  >
                                                    <CheckIcon
                                                      className="h-5 w-5"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </Combobox.Option>
                                        )
                                      )}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.religion && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.religion && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.religion.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name="education"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedEducations}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedEducations(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Education
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.education
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryEducations(event.target.value)
                                    }
                                    displayValue={(education) => education.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.education
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredEducations.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredEducations.map(
                                        (education) => (
                                          <Combobox.Option
                                            key={education.id}
                                            value={education}
                                            className={({ active }) =>
                                              classNames(
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                                active
                                                  ? "bg-indigo-600 text-white"
                                                  : "text-gray-900"
                                              )
                                            }
                                          >
                                            {({ active, selected }) => (
                                              <>
                                                <span
                                                  className={classNames(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                  )}
                                                >
                                                  {education.name}
                                                </span>

                                                {selected && (
                                                  <span
                                                    className={classNames(
                                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                                      active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                    )}
                                                  >
                                                    <CheckIcon
                                                      className="h-5 w-5"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </Combobox.Option>
                                        )
                                      )}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.education && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.education && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.education.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>

                        <div>
                          <Controller
                            control={control}
                            name="major"
                            render={({ field: { onChange } }) => (
                              <Combobox
                                as="div"
                                value={selectedMajors}
                                onChange={(event) => {
                                  onChange({
                                    target: {
                                      value: event.id,
                                    },
                                  });

                                  return setSelectedMajors(event);
                                }}
                              >
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                  Major
                                </Combobox.Label>
                                <div className="relative mt-1">
                                  <Combobox.Input
                                    className={classNames(
                                      !formState.errors.major
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                      "block w-full rounded-md shadow-sm sm:text-sm"
                                    )}
                                    onChange={(event) =>
                                      setQueryMajors(event.target.value)
                                    }
                                    displayValue={(major) => major.name}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <SelectorIcon
                                      className={classNames(
                                        !formState.errors.major
                                          ? "text-gray-400"
                                          : "text-red-500",
                                        "h-5 w-5 "
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  {filteredMajors.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredMajors.map((major) => (
                                        <Combobox.Option
                                          key={major.id}
                                          value={major}
                                          className={({ active }) =>
                                            classNames(
                                              "relative cursor-default select-none py-2 pl-3 pr-9",
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                            )
                                          }
                                        >
                                          {({ active, selected }) => (
                                            <>
                                              <span
                                                className={classNames(
                                                  "block truncate",
                                                  selected && "font-semibold"
                                                )}
                                              >
                                                {major.name}
                                              </span>

                                              {selected && (
                                                <span
                                                  className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      ))}
                                    </Combobox.Options>
                                  )}

                                  {formState.errors.major && (
                                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                      <ExclamationCircleIcon
                                        className="h-5 w-5 text-red-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </div>

                                {formState.errors.major && (
                                  <p
                                    className="mt-2 text-sm text-red-600"
                                    id="email-error"
                                  >
                                    {formState.errors.major.message}.
                                  </p>
                                )}
                              </Combobox>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 px-4 py-6 sm:space-y-5 sm:px-6">
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Insurance
                        </h3>
                      </div>

                      {fields.length > 0 ? (
                        fields.map((field, index) => {
                          return (
                            <div key={field.id}>
                              <section className={"section"} key={field.id}>
                                <Controller
                                  control={control}
                                  name={`insurance.${index}`}
                                  render={({ field: { onChange } }) => (
                                    <Combobox
                                      as="div"
                                      value={selectedInsurances[index]}
                                      onChange={(event) => {
                                        onChange({
                                          target: {
                                            value: event.id,
                                          },
                                        });

                                        let newSelectedInsurances = [
                                          ...selectedInsurances,
                                        ];

                                        let selectedInsurance = {
                                          ...newSelectedInsurances[index],
                                        };

                                        selectedInsurance = event;

                                        newSelectedInsurances[index] =
                                          selectedInsurance;

                                        return setSelectedInsurances(
                                          newSelectedInsurances
                                        );
                                      }}
                                    >
                                      <div className="relative mt-1">
                                        <div className="flex">
                                          <Combobox.Input
                                            className={classNames(
                                              !formState.errors.insurance
                                                ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                : "border-red-300 focus:border-red-500 focus:ring-red-500",
                                              "block w-full rounded-none rounded-l-md shadow-sm focus:ring-inset sm:text-sm"
                                            )}
                                            onChange={(event) =>
                                              setQueryInsurances(
                                                event.target.value
                                              )
                                            }
                                            displayValue={(insurance) =>
                                              insurance.name
                                            }
                                          />
                                          <Combobox.Button className="absolute inset-y-0 right-14 flex items-center rounded-r-md px-2 focus:outline-none">
                                            <SelectorIcon
                                              className={classNames(
                                                !formState.errors.insurance
                                                  ? "text-gray-400"
                                                  : "text-red-500",
                                                "h-5 w-5 "
                                              )}
                                              aria-hidden="true"
                                            />
                                          </Combobox.Button>

                                          <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                          >
                                            <MinusSmIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </button>
                                        </div>

                                        {filteredInsurances.length > 0 && (
                                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredInsurances.map(
                                              (insurance, index) => (
                                                <Combobox.Option
                                                  key={index}
                                                  value={insurance}
                                                  className={({ active }) =>
                                                    classNames(
                                                      "relative cursor-default select-none py-2 pl-3 pr-9",
                                                      active
                                                        ? "bg-indigo-600 text-white"
                                                        : "text-gray-900"
                                                    )
                                                  }
                                                >
                                                  {({ active, selected }) => (
                                                    <>
                                                      <span
                                                        className={classNames(
                                                          "block truncate",
                                                          selected &&
                                                            "font-semibold"
                                                        )}
                                                      >
                                                        {insurance.name}
                                                      </span>

                                                      {selected && (
                                                        <span
                                                          className={classNames(
                                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                                            active
                                                              ? "text-white"
                                                              : "text-indigo-600"
                                                          )}
                                                        >
                                                          <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                          />
                                                        </span>
                                                      )}
                                                    </>
                                                  )}
                                                </Combobox.Option>
                                              )
                                            )}
                                          </Combobox.Options>
                                        )}

                                        {formState.errors.insurance && (
                                          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
                                            <ExclamationCircleIcon
                                              className="h-5 w-5 text-red-500"
                                              aria-hidden="true"
                                            />
                                          </div>
                                        )}
                                      </div>

                                      {formState.errors.insurance && (
                                        <p
                                          className="mt-2 text-sm text-red-600"
                                          id="email-error"
                                        >
                                          {formState.errors.insurance.message}.
                                        </p>
                                      )}
                                    </Combobox>
                                  )}
                                />
                              </section>
                            </div>
                          );
                        })
                      ) : (
                        <div className="block text-center text-sm font-medium text-gray-700">
                          <span>No Insurance</span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          append({
                            insurance: "",
                          });
                        }}
                        type="button"
                        className="block w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Add Insurance
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Create;
