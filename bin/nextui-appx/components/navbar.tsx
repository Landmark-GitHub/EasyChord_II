// import {
//   Navbar as NextUINavbar,
//   NavbarContent,
//   NavbarMenu,
//   NavbarMenuToggle,
//   NavbarBrand,
//   NavbarItem,
//   NavbarMenuItem,
// } from "@nextui-org/navbar";
// import { Button } from "@nextui-org/button";
// import { Kbd } from "@nextui-org/kbd";
// import { Link } from "@nextui-org/link";
// import { Input } from "@nextui-org/input";
// import { link as linkStyles } from "@nextui-org/theme";
// import NextLink from "next/link";
// import clsx from "clsx";

// import { siteConfig } from "@/config/site";
// import { ThemeSwitch } from "@/components/theme-switch";
// import {
//   TwitterIcon,
//   GithubIcon,
//   DiscordIcon,
//   HeartFilledIcon,
//   SearchIcon,
//   Logo,
// } from "@/components/icons";

// export const Navbar = () => {
//   const searchInput = (
//     <Input
//       aria-label="Search"
//       classNames={{
//         inputWrapper: "bg-default-100",
//         input: "text-sm",
//       }}
//       endContent={
//         <Kbd className="hidden lg:inline-block" keys={["command"]}>
//           K
//         </Kbd>
//       }
//       labelPlacement="outside"
//       placeholder="Search..."
//       startContent={
//         <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
//       }
//       type="search"
//     />
//   );

//   return (
//     <NextUINavbar maxWidth="xl" position="sticky">
//       <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
//         <NavbarBrand as="li" className="gap-3 max-w-fit">
//           <NextLink className="flex justify-start items-center gap-1" href="/">
//             <Logo />
//             <p className="font-bold text-inherit">ACME</p>
//           </NextLink>
//         </NavbarBrand>
//         <ul className="hidden lg:flex gap-4 justify-start ml-2">
//           {siteConfig.navItems.map((item) => (
//             <NavbarItem key={item.href}>
//               <NextLink
//                 className={clsx(
//                   linkStyles({ color: "foreground" }),
//                   "data-[active=true]:text-primary data-[active=true]:font-medium",
//                 )}
//                 color="foreground"
//                 href={item.href}
//               >
//                 {item.label}
//               </NextLink>
//             </NavbarItem>
//           ))}
//         </ul>
//       </NavbarContent>

//       <NavbarContent
//         className="hidden sm:flex basis-1/5 sm:basis-full"
//         justify="end"
//       >
//         <NavbarItem className="hidden sm:flex gap-2">
//           <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
//             <TwitterIcon className="text-default-500" />
//           </Link>
//           <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
//             <DiscordIcon className="text-default-500" />
//           </Link>
//           <Link isExternal aria-label="Github" href={siteConfig.links.github}>
//             <GithubIcon className="text-default-500" />
//           </Link>
//           <ThemeSwitch />
//         </NavbarItem>
//         <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
//         <NavbarItem className="hidden md:flex">
//           <Button
//             isExternal
//             as={Link}
//             className="text-sm font-normal text-default-600 bg-default-100"
//             href={siteConfig.links.sponsor}
//             startContent={<HeartFilledIcon className="text-danger" />}
//             variant="flat"
//           >
//             Sponsor
//           </Button>
//         </NavbarItem>
//       </NavbarContent>

//       <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
//         <Link isExternal aria-label="Github" href={siteConfig.links.github}>
//           <GithubIcon className="text-default-500" />
//         </Link>
//         <ThemeSwitch />
//         <NavbarMenuToggle />
//       </NavbarContent>

//       <NavbarMenu>
//         {searchInput}
//         <div className="mx-4 mt-2 flex flex-col gap-2">
//           {siteConfig.navMenuItems.map((item, index) => (
//             <NavbarMenuItem key={`${item}-${index}`}>
//               <Link
//                 color={
//                   index === 2
//                     ? "primary"
//                     : index === siteConfig.navMenuItems.length - 1
//                       ? "danger"
//                       : "foreground"
//                 }
//                 href="#"
//                 size="lg"
//               >
//                 {item.label}
//               </Link>
//             </NavbarMenuItem>
//           ))}
//         </div>
//       </NavbarMenu>
//     </NextUINavbar>
//   );
// };


'use client';
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  SearchIcon,
  Logo,
} from "@/components/icons";

const SignInModal = ({ isOpen, onOpenChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name,
      email,
      password
    };
    console.table(data);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"}>
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
              <ModalBody>
                <Input 
                  type="text" 
                  variant={"bordered"} 
                  label="Name" 
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)} 
                />
                <Input 
                  type="email" 
                  variant={"bordered"} 
                  label="Email" 
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
                />
                <Input 
                  type={isVisible ? "text" : "password"} 
                  variant={"bordered"} 
                  label="Password"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <p className="text-2xl text-default-400 pointer-events-none">do</p>
                      ) : (
                        <p className="text-2xl text-default-400 pointer-events-none">x</p>
                      )}
                    </button>
                  }
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} 
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Sign In
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const LogInModal = ({ isOpen, onOpenChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      email,
      password
    };
    console.table(data);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"}>
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">Log In</ModalHeader>
              <ModalBody>
                <Input 
                  type="email" 
                  variant={"bordered"} 
                  label="Email" 
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
                />
                <Input 
                  type={isVisible ? "text" : "password"} 
                  variant={"bordered"} 
                  label="Password"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <p className="text-2xl text-default-400 pointer-events-none">
                          do
                        </p>
                      ) : (
                        <p className="text-2xl text-default-400 pointer-events-none">
                          x
                        </p>
                      )}
                    </button>
                  }
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} 
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Log In
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const Navbar = () => {
  const router = useRouter();
  const [keywordMusic, setKeywordMusic] = useState<string>("");
  const signInModal = useDisclosure();
  const logInModal = useDisclosure();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/?keyword=${keywordMusic}`);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeywordMusic(event.target.value);
  };

  const searchInput = (
    <form onSubmit={handleSubmit}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <SearchIcon/>
        }
        labelPlacement="outside"
        placeholder="Search..."
        // startContent={
        //   <p>img st</p>
        // }
        type="search"
        value={keywordMusic}
        onChange={handleInputChange}
      />
    </form>
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ECJA</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

        <NavbarItem className="hidden md:flex gap-2">
          <ThemeSwitch />
          <Button onPress={signInModal.onOpen} className="text-sm font-normal text-default-600 bg-default-100">
            Sign in
          </Button>
          <Button onPress={logInModal.onOpen} className="text-sm font-normal text-default-600 bg-default-100">
            Log in
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
      <SignInModal isOpen={signInModal.isOpen} onOpenChange={signInModal.onOpenChange} />
      <LogInModal isOpen={logInModal.isOpen} onOpenChange={logInModal.onOpenChange} />
    </NextUINavbar>
  );
};

export default Navbar;
